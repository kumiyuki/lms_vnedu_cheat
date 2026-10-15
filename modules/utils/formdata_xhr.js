/**
 * convert from normal Object to FormData
 * 
 * @param {Object} obj 
 * @returns {FormData} data
 */
export const create_formdata_body = (obj) => {
  if (!(obj instanceof Object)) return;
  const f_data = new FormData();
  const keys = Object.keys(obj);

  for (const key of keys) {
    f_data.append(key, obj[key]);
  }

  return f_data;
}