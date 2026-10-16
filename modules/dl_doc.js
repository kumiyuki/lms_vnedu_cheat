import { Logger, Network } from "kumiyui";

let document_pages = {}
Network.register_network_hook("after", async (req, res) => {
  const url = req.args[0];
  if (
    // for hardcoded images
    (!url.includes("filesystem/client/viewer") || !url.includes("?format=")) &&
    // for pdf/presentation/document files
    !url.includes("service/lessonPresentation/study")
  )
    return;

  document_pages = await res.json();
})

/**
 * @param {object} options
 * @param {Logger} options.logger
 */
export const dl_doc = ({ logger }) => {
  const main = async () => {
    console.log(document_pages);
    if (document_pages.success !== true)
      return logger.error("latest document return success = false");
    logger.info("found information about latest document")

    // for non-hardcoded images
    if (document_pages.msg?.toString().toLowerCase().replaceAll(" ", "") === "study") {
      const document_info = document_pages?.data?.lessonPresentation;
      const file_url = document_info?.file_url;
      const file_extension = document_info?.file_extension ?? "pdf";
      const file_name = new URL(file_url).pathname.split("/").splice(-1) ?? `${dl}.${file_extension}`;
      
      try {
        const download_link = document.createElement("a");
        download_link.href = file_url;
        download_link.download = file_name;

        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);
        download_link.remove();
        logger.info("file downloaded!")
      } catch (e) {
        logger.error("failed to download the document:", e);
      }
    }

    // for hardcoded images
    if (document_pages.msg?.toString().toLowerCase().replaceAll(" ", "") === "images" && Array.isArray(document_pages.data)) {
      // get images data
      const arr_img = document_pages.data ?? [];

      const compressed = new JSZip();

      const fetch_promises = arr_img.map(async (img, index) => {
        try {
          const response = await fetch(img, { credentials: "include" });
          const blob = await response.blob();
          compressed.file(`image_${index + 1}.jpg`, blob);
          logger.info(`successfully added image_${index + 1}.jpg to the zip file.`)
        } catch (e) {
          logger.error(`failed to include image_${index + 1}.jpg, error:`, e);
        }
      })

      // wait until all files get added to the zip file
      await Promise.all(fetch_promises);
      logger.info("all images retrieved. compressing files into a single bundle...");

      try {
        const zip_blob = await compressed.generateAsync({ type: "blob" });
        const download_url = URL.createObjectURL(zip_blob);

        const download_link = document.createElement("a");
        download_link.href = download_url;
        download_link.download = `dl_img_${Date.now()}.zip`;

        document.body.appendChild(download_link);
        download_link.click();
        document.body.removeChild(download_link);
        download_link.remove();

        // free the memory
        URL.revokeObjectURL(download_url);
        logger.info("zip file downloaded!")
      } catch (e) {
        logger.error("failed to generate or download the zip package:", e);
      }
    }
  }

  return {
    command_name: "download document pages/presentation slides",
    command: "dl_doc",
    aliases: ["dl!doc", "dl_pdf", "dl!pdf", "dl_presentation_slides", "dl_presentation_slide", "dl_slide", "rip_slide", "dl!slide", "rip!slide"],
    description: "perform a 1:1 download of the course document pages (note: some documents might be uploaded as images)",
    is_toggle: false,
    callback_fn: main
  }
}