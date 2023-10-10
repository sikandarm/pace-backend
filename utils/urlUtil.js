class UrlUtil {
  static join = (...params) => {
    return params.map((p) => p.replace(/^\/+|\/+$/g, "")).join("/");
  };
}

module.exports = UrlUtil;
