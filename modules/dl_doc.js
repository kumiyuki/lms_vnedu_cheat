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

      for (let index = 0; index < arr_img.length; index++) {
        const img = arr_img[index];
        await new Promise((resolve) => setTimeout(resolve, 2500));
        await new Promise(async (resolve) => {
          try {
            const response = await fetch(img, { credentials: "include" });
            const blob = await response.blob();

            // file extension
            let file_extension = ".png";
            if (blob.type) {
              const mime_map = {
                "image/png": ".png",
                "image/jpeg": ".jpg",
                "image/gif": ".gif",
                "image/webp": ".webp",
                "image/svg+xml": ".svg",
                "application/pdf": ".pdf"
              }

              if (mime_map[blob.type])
                file_extension = mime_map[blob.type];
            }

            // check for blob size
            if (blob.size <= 0)
              return logger.error(`image_${index + 1}${file_extension} return empty blob!!`)

            // download
            const download_url = URL.createObjectURL(blob);

            const download_link = document.createElement("a");
            download_link.href = download_url;
            download_link.download = `image_${index + 1}_${Date.now()}${file_extension}`;

            document.body.appendChild(download_link);
            download_link.click();
            document.body.removeChild(download_link);
            download_link.remove();

            // free the memory
            URL.revokeObjectURL(download_url);

            // success
            logger.info(`successfully downloaded image_${index + 1}${file_extension}`);
            resolve();
          } catch (e) {
            logger.error(`failed to download image_${index + 1}${file_extension}, error:`, e);
            resolve();
          }
        })
      }

      // all image downloaded
      await Promise.all(fetch_promises);
      logger.info("all images downloaded!!");
    }
  }

  return {
    command_name: "download document pages/presentation slides",
    command: "dl_doc",
    aliases: ["dl!doc", "dl_pdf", "dl!pdf", "dl_presentation_slides", "dl_presentation_slide", "dl_slide", "rip_slide", "dl!slide"],
    description: "perform a 1:1 download of the course document pages (note: some documents might be uploaded as images)",
    is_toggle: false,
    callback_fn: main
  }
}