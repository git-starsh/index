(() => {
  var __defProp = Object.defineProperty;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

  // src/utils.js
  var PATH_LENGTH = 7;
  function checkStartsWith(str2, prefix) {
    if (str2 === void 0 || str2 === null || prefix === void 0 || prefix === null) {
      return false;
    }
    str2 = String(str2);
    prefix = String(prefix);
    return str2.slice(0, prefix.length) === prefix;
  }
  __name(checkStartsWith, "checkStartsWith");
  function encodeBase64(input) {
    const encoder = new TextEncoder();
    const utf8Array = encoder.encode(input);
    let binaryString = "";
    for (const byte of utf8Array) {
      binaryString += String.fromCharCode(byte);
    }
    return base64FromBinary(binaryString);
  }
  __name(encodeBase64, "encodeBase64");
  function decodeBase64(input) {
    const binaryString = base64ToBinary(input);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  }
  __name(decodeBase64, "decodeBase64");
  function base64FromBinary(binaryString) {
    const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let base64String = "";
    let padding = "";
    const remainder = binaryString.length % 3;
    if (remainder > 0) {
      padding = "=".repeat(3 - remainder);
      binaryString += "\0".repeat(3 - remainder);
    }
    for (let i = 0; i < binaryString.length; i += 3) {
      const bytes = [
        binaryString.charCodeAt(i),
        binaryString.charCodeAt(i + 1),
        binaryString.charCodeAt(i + 2)
      ];
      const base64Index1 = bytes[0] >> 2;
      const base64Index2 = (bytes[0] & 3) << 4 | bytes[1] >> 4;
      const base64Index3 = (bytes[1] & 15) << 2 | bytes[2] >> 6;
      const base64Index4 = bytes[2] & 63;
      base64String += base64Chars[base64Index1] + base64Chars[base64Index2] + base64Chars[base64Index3] + base64Chars[base64Index4];
    }
    return base64String.slice(0, base64String.length - padding.length) + padding;
  }
  __name(base64FromBinary, "base64FromBinary");
  function base64ToBinary(base64String) {
    const base64Chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    let binaryString = "";
    base64String = base64String.replace(/=+$/, "");
    for (let i = 0; i < base64String.length; i += 4) {
      const bytes = [
        base64Chars.indexOf(base64String[i]),
        base64Chars.indexOf(base64String[i + 1]),
        base64Chars.indexOf(base64String[i + 2]),
        base64Chars.indexOf(base64String[i + 3])
      ];
      const byte1 = bytes[0] << 2 | bytes[1] >> 4;
      const byte2 = (bytes[1] & 15) << 4 | bytes[2] >> 2;
      const byte3 = (bytes[2] & 3) << 6 | bytes[3];
      if (bytes[1] !== -1)
        binaryString += String.fromCharCode(byte1);
      if (bytes[2] !== -1)
        binaryString += String.fromCharCode(byte2);
      if (bytes[3] !== -1)
        binaryString += String.fromCharCode(byte3);
    }
    return binaryString;
  }
  __name(base64ToBinary, "base64ToBinary");
  function DeepCopy(obj) {
    if (obj === null || typeof obj !== "object") {
      return obj;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => DeepCopy(item));
    }
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = DeepCopy(obj[key]);
      }
    }
    return newObj;
  }
  __name(DeepCopy, "DeepCopy");
  function GenerateWebPath(length = PATH_LENGTH) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }
  __name(GenerateWebPath, "GenerateWebPath");
  function parseServerInfo(serverInfo) {
    let host, port;
    if (serverInfo.startsWith("[")) {
      const closeBracketIndex = serverInfo.indexOf("]");
      host = serverInfo.slice(1, closeBracketIndex);
      port = serverInfo.slice(closeBracketIndex + 2);
    } else {
      const lastColonIndex = serverInfo.lastIndexOf(":");
      host = serverInfo.slice(0, lastColonIndex);
      port = serverInfo.slice(lastColonIndex + 1);
    }
    return { host, port: parseInt(port) };
  }
  __name(parseServerInfo, "parseServerInfo");
  function parseUrlParams(url) {
    const [, rest] = url.split("://");
    const [addressPart, ...remainingParts] = rest.split("?");
    const paramsPart = remainingParts.join("?");
    const [paramsOnly, ...fragmentParts] = paramsPart.split("#");
    const searchParams = new URLSearchParams(paramsOnly);
    const params = Object.fromEntries(searchParams.entries());
    let name = fragmentParts.length > 0 ? fragmentParts.join("#") : "";
    try {
      name = decodeURIComponent(name);
    } catch (error) {
    }
    ;
    return { addressPart, params, name };
  }
  __name(parseUrlParams, "parseUrlParams");
  function createTlsConfig(params) {
    let tls = { enabled: false };
    if (params.security != "none") {
      tls = {
        enabled: true,
        server_name: params.sni || params.host,
        insecure: !!params?.allowInsecure || !!params?.insecure || !!params?.allow_insecure
        // utls: {
        //   enabled: true,
        //   fingerprint: "chrome"
        // },
      };
      if (params.security === "reality") {
        tls.reality = {
          enabled: true,
          public_key: params.pbk,
          short_id: params.sid
        };
      }
    }
    return tls;
  }
  __name(createTlsConfig, "createTlsConfig");
  function createTransportConfig(params) {
    return {
      type: params.type,
      path: params.path ?? void 0,
      ...params.host && { "headers": { "host": params.host } },
      ...params.type === "grpc" && {
        service_name: params.serviceName ?? void 0
      }
    };
  }
  __name(createTransportConfig, "createTransportConfig");

  // src/i18n/index.js
  var translations = {
    "zh-CN": {
      missingInput: "\u7F3A\u5C11\u8F93\u5165\u53C2\u6570",
      missingConfig: "\u7F3A\u5C11\u914D\u7F6E\u53C2\u6570",
      missingUrl: "\u7F3A\u5C11URL\u53C2\u6570",
      shortUrlNotFound: "\u77ED\u94FE\u63A5\u672A\u627E\u5230",
      invalidShortUrl: "\u65E0\u6548\u7684\u77ED\u94FE\u63A5",
      internalError: "\u5185\u90E8\u670D\u52A1\u5668\u9519\u8BEF",
      notFound: "\u672A\u627E\u5230",
      invalidFormat: "\u65E0\u6548\u683C\u5F0F\uFF1A",
      defaultRules: ["\u5E7F\u544A\u62E6\u622A", "\u8C37\u6B4C\u670D\u52A1", "\u56FD\u5916\u5A92\u4F53", "\u7535\u62A5\u6D88\u606F"],
      configValidationError: "\u914D\u7F6E\u9A8C\u8BC1\u9519\u8BEF\uFF1A",
      pageDescription: "Sublink Worker - \u8BA2\u9605\u94FE\u63A5\u8F6C\u6362\u5DE5\u5177",
      pageKeywords: "\u8BA2\u9605\u94FE\u63A5,\u8F6C\u6362,Xray,SingBox,Clash,Surge",
      pageTitle: "Sublink Worker - \u8BA2\u9605\u94FE\u63A5\u8F6C\u6362\u5DE5\u5177",
      ogTitle: "Sublink Worker - \u8BA2\u9605\u94FE\u63A5\u8F6C\u6362\u5DE5\u5177",
      ogDescription: "\u4E00\u4E2A\u5F3A\u5927\u7684\u8BA2\u9605\u94FE\u63A5\u8F6C\u6362\u5DE5\u5177\uFF0C\u652F\u6301\u591A\u79CD\u5BA2\u6237\u7AEF\u683C\u5F0F",
      shareUrls: "\u5206\u4EAB\u94FE\u63A5",
      urlPlaceholder: "\u5728\u6B64\u8F93\u5165\u5206\u4EAB\u94FE\u63A5\uFF08\u53EF\u76F4\u63A5\u7C98\u8D34\u4E4B\u524D\u751F\u6210\u7684\u94FE\u63A5\u5FEB\u901F\u89E3\u6790\u914D\u7F6E\uFF09...",
      advancedOptions: "\u9AD8\u7EA7\u9009\u9879",
      baseConfigSettings: "\u57FA\u7840\u914D\u7F6E\u8BBE\u7F6E",
      baseConfigTooltip: "\u5728\u6B64\u5904\u81EA\u5B9A\u4E49\u60A8\u7684\u57FA\u7840\u914D\u7F6E",
      saveConfig: "\u4FDD\u5B58\u914D\u7F6E",
      clearConfig: "\u6E05\u9664\u914D\u7F6E",
      convert: "\u8F6C\u6362",
      clear: "\u6E05\u9664",
      customPath: "\u81EA\u5B9A\u4E49\u8DEF\u5F84",
      savedPaths: "\u5DF2\u4FDD\u5B58\u7684\u8DEF\u5F84",
      shortenLinks: "\u751F\u6210\u77ED\u94FE\u63A5",
      ruleSelection: "\u89C4\u5219\u9009\u62E9",
      ruleSelectionTooltip: "\u9009\u62E9\u60A8\u9700\u8981\u7684\u89C4\u5219\u96C6",
      custom: "\u81EA\u5B9A\u4E49",
      minimal: "\u6700\u5C0F\u5316",
      balanced: "\u5747\u8861",
      comprehensive: "\u5168\u9762",
      addCustomRule: "\u6DFB\u52A0\u81EA\u5B9A\u4E49\u89C4\u5219",
      customRuleOutboundName: "\u51FA\u7AD9\u540D\u79F0*",
      customRuleGeoSite: "Geo-Site\u89C4\u5219\u96C6",
      customRuleGeoSiteTooltip: "SingBox\u4E2D\u7684Site\u89C4\u5219\u6765\u81EA https://github.com/lyc8503/sing-box-rules\uFF0C\u8FD9\u610F\u5473\u7740\u60A8\u7684\u81EA\u5B9A\u4E49\u89C4\u5219\u5FC5\u987B\u5728\u8BE5\u4ED3\u5E93\u4E2D",
      customRuleGeoSitePlaceholder: "\u4F8B\u5982\uFF1Agoogle,anthropic",
      customRuleGeoIP: "Geo-IP\u89C4\u5219\u96C6",
      customRuleGeoIPTooltip: "SingBox\u4E2D\u7684IP\u89C4\u5219\u6765\u81EA https://github.com/lyc8503/sing-box-rules\uFF0C\u8FD9\u610F\u5473\u7740\u60A8\u7684\u81EA\u5B9A\u4E49\u89C4\u5219\u5FC5\u987B\u5728\u8BE5\u4ED3\u5E93\u4E2D",
      customRuleGeoIPPlaceholder: "\u4F8B\u5982\uFF1Aprivate,cn",
      customRuleDomainSuffix: "\u57DF\u540D\u540E\u7F00",
      customRuleDomainSuffixPlaceholder: "\u57DF\u540D\u540E\u7F00\uFF08\u7528\u9017\u53F7\u5206\u9694\uFF09",
      customRuleDomainKeyword: "\u57DF\u540D\u5173\u952E\u8BCD",
      customRuleDomainKeywordPlaceholder: "\u57DF\u540D\u5173\u952E\u8BCD\uFF08\u7528\u9017\u53F7\u5206\u9694\uFF09",
      customRuleIPCIDR: "IP CIDR",
      customRuleIPCIDRPlaceholder: "IP CIDR\uFF08\u7528\u9017\u53F7\u5206\u9694\uFF09",
      customRuleProtocol: "\u534F\u8BAE\u7C7B\u578B",
      customRuleProtocolTooltip: "\u7279\u5B9A\u6D41\u91CF\u7C7B\u578B\u7684\u534F\u8BAE\u89C4\u5219\u3002\u66F4\u591A\u8BE6\u60C5\uFF1Ahttps://sing-box.sagernet.org/configuration/route/sniff/",
      customRuleProtocolPlaceholder: "\u534F\u8BAE\uFF08\u7528\u9017\u53F7\u5206\u9694\uFF0C\u4F8B\u5982\uFF1Ahttp,ssh,dns\uFF09",
      removeCustomRule: "\u79FB\u9664",
      addCustomRuleJSON: "\u6DFB\u52A0JSON\u89C4\u5219",
      customRuleJSON: "JSON\u89C4\u5219",
      customRuleJSONTooltip: "\u4F7F\u7528JSON\u683C\u5F0F\u6DFB\u52A0\u81EA\u5B9A\u4E49\u89C4\u5219\uFF0C\u652F\u6301\u6279\u91CF\u6DFB\u52A0",
      customRulesSection: "\u81EA\u5B9A\u4E49\u89C4\u5219",
      customRulesSectionTooltip: "\u521B\u5EFA\u81EA\u5B9A\u4E49\u8DEF\u7531\u89C4\u5219\u6765\u63A7\u5236\u7279\u5B9A\u6D41\u91CF\u7684\u8DEF\u7531\u884C\u4E3A\u3002\u652F\u6301\u8868\u5355\u548CJSON\u4E24\u79CD\u7F16\u8F91\u65B9\u5F0F\uFF0C\u53EF\u4EE5\u76F8\u4E92\u8F6C\u6362\u3002",
      customRulesForm: "\u8868\u5355\u89C6\u56FE",
      customRulesJSON: "JSON\u89C6\u56FE",
      customRule: "\u81EA\u5B9A\u4E49\u89C4\u5219",
      convertToJSON: "\u8F6C\u6362\u4E3AJSON",
      convertToForm: "\u8F6C\u6362\u4E3A\u8868\u5355",
      validateJSON: "\u9A8C\u8BC1JSON",
      clearAll: "\u6E05\u7A7A\u6240\u6709",
      addJSONRule: "\u6DFB\u52A0JSON\u89C4\u5219",
      noCustomRulesForm: '\u70B9\u51FB"\u6DFB\u52A0\u81EA\u5B9A\u4E49\u89C4\u5219"\u5F00\u59CB\u521B\u5EFA\u89C4\u5219',
      noCustomRulesJSON: '\u70B9\u51FB"\u6DFB\u52A0JSON\u89C4\u5219"\u5F00\u59CB\u521B\u5EFA\u89C4\u5219',
      confirmClearAllRules: "\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u81EA\u5B9A\u4E49\u89C4\u5219\u5417\uFF1F",
      noFormRulesToConvert: "\u6CA1\u6709\u8868\u5355\u89C4\u5219\u53EF\u4EE5\u8F6C\u6362",
      noValidJSONToConvert: "\u6CA1\u6709\u6709\u6548\u7684JSON\u89C4\u5219\u53EF\u4EE5\u8F6C\u6362",
      convertedFromForm: "\u4ECE\u8868\u5355\u8F6C\u6362",
      convertedFromJSON: "\u4ECEJSON\u8F6C\u6362",
      mustBeArray: "\u5FC5\u987B\u662F\u6570\u7EC4\u683C\u5F0F",
      nameRequired: "\u89C4\u5219\u540D\u79F0\u662F\u5FC5\u9700\u7684",
      invalidJSON: "\u65E0\u6548\u7684JSON\u683C\u5F0F",
      allJSONValid: "\u6240\u6709JSON\u89C4\u5219\u90FD\u6709\u6548\uFF01",
      jsonValidationErrors: "JSON\u9A8C\u8BC1\u9519\u8BEF",
      // 规则名称和出站名称的翻译
      outboundNames: {
        "Auto Select": "\u26A1 \u81EA\u52A8\u9009\u62E9",
        "Node Select": "\u{1F680} \u8282\u70B9\u9009\u62E9",
        "Fall Back": "\u{1F41F} \u6F0F\u7F51\u4E4B\u9C7C",
        "Ad Block": "\u{1F6D1} \u5E7F\u544A\u62E6\u622A",
        "AI Services": "\u{1F4AC} AI \u670D\u52A1",
        "Bilibili": "\u{1F4FA} \u54D4\u54E9\u54D4\u54E9",
        "Youtube": "\u{1F4F9} \u6CB9\u7BA1\u89C6\u9891",
        "Google": "\u{1F50D} \u8C37\u6B4C\u670D\u52A1",
        "Private": "\u{1F3E0} \u79C1\u6709\u7F51\u7EDC",
        "Location:CN": "\u{1F512} \u56FD\u5185\u670D\u52A1",
        "Telegram": "\u{1F4F2} \u7535\u62A5\u6D88\u606F",
        "Github": "\u{1F431} Github",
        "Microsoft": "\u24C2\uFE0F \u5FAE\u8F6F\u670D\u52A1",
        "Apple": "\u{1F34F} \u82F9\u679C\u670D\u52A1",
        "Social Media": "\u{1F310} \u793E\u4EA4\u5A92\u4F53",
        "Streaming": "\u{1F3AC} \u6D41\u5A92\u4F53",
        "Gaming": "\u{1F3AE} \u6E38\u620F\u5E73\u53F0",
        "Education": "\u{1F4DA} \u6559\u80B2\u8D44\u6E90",
        "Financial": "\u{1F4B0} \u91D1\u878D\u670D\u52A1",
        "Cloud Services": "\u2601\uFE0F \u4E91\u670D\u52A1",
        "Non-China": "\u{1F310} \u975E\u4E2D\u56FD",
        "GLOBAL": "GLOBAL"
      },
      UASettings: "\u81EA\u5B9A\u4E49UserAgent",
      UAtip: "\u9ED8\u8BA4\u503Ccurl/7.74.0"
    },
    "en-US": {
      missingInput: "Missing input parameter",
      missingConfig: "Missing config parameter",
      missingUrl: "Missing URL parameter",
      shortUrlNotFound: "Short URL not found",
      invalidShortUrl: "Invalid short URL",
      internalError: "Internal Server Error",
      notFound: "Not Found",
      invalidFormat: "Invalid format: ",
      defaultRules: ["Ad Blocking", "Google Services", "Foreign Media", "Telegram"],
      configValidationError: "Config validation error: ",
      pageDescription: "Sublink Worker - Subscription Link Converter",
      pageKeywords: "subscription link,converter,Xray,SingBox,Clash,Surge",
      pageTitle: "Sublink Worker - Subscription Link Converter",
      ogTitle: "Sublink Worker - Subscription Link Converter",
      ogDescription: "A powerful subscription link converter supporting multiple client formats",
      shareUrls: "Share URLs",
      urlPlaceholder: "Enter your share links here (paste previously generated links for quick config parsing)...",
      advancedOptions: "Advanced Options",
      baseConfigSettings: "Base Config Settings",
      baseConfigTooltip: "Customize your base configuration here",
      saveConfig: "Save Config",
      clearConfig: "Clear Config",
      convert: "Convert",
      clear: "Clear",
      customPath: "Custom Path",
      savedPaths: "Saved Paths",
      shortenLinks: "Generate Short Links",
      ruleSelection: "Rule Selection",
      ruleSelectionTooltip: "Select your desired rule sets",
      custom: "Custom",
      minimal: "Minimal",
      balanced: "Balanced",
      comprehensive: "Comprehensive",
      addCustomRule: "Add Custom Rule",
      customRuleOutboundName: "Outbound Name*",
      customRuleGeoSite: "Geo-Site Rules",
      customRuleGeoSiteTooltip: "SingBox Site rules come from https://github.com/lyc8503/sing-box-rules, which means your custom rules must be in that repository",
      customRuleGeoSitePlaceholder: "e.g., google,anthropic",
      customRuleGeoIP: "Geo-IP Rules",
      customRuleGeoIPTooltip: "SingBox IP rules come from https://github.com/lyc8503/sing-box-rules, which means your custom rules must be in that repository",
      customRuleGeoIPPlaceholder: "e.g., private,cn",
      customRuleDomainSuffix: "Domain Suffix",
      customRuleDomainSuffixPlaceholder: "Domain suffixes (comma separated)",
      customRuleDomainKeyword: "Domain Keyword",
      customRuleDomainKeywordPlaceholder: "Domain keywords (comma separated)",
      customRuleIPCIDR: "IP CIDR",
      customRuleIPCIDRPlaceholder: "IP CIDR (comma separated)",
      customRuleProtocol: "Protocol Type",
      customRuleProtocolTooltip: "Protocol rules for specific traffic types. More details: https://sing-box.sagernet.org/configuration/route/sniff/",
      customRuleProtocolPlaceholder: "Protocols (comma separated, e.g., http,ssh,dns)",
      removeCustomRule: "Remove",
      addCustomRuleJSON: "Add JSON Rule",
      customRuleJSON: "JSON Rule",
      customRuleJSONTooltip: "Add custom rules using JSON format, supports batch adding",
      customRulesSection: "Custom Rules",
      customRulesSectionTooltip: "Create custom routing rules to control traffic routing behavior. Supports both form and JSON editing modes with bidirectional conversion.",
      customRulesForm: "Form View",
      customRulesJSON: "JSON View",
      customRule: "Custom Rule",
      convertToJSON: "Convert to JSON",
      convertToForm: "Convert to Form",
      validateJSON: "Validate JSON",
      clearAll: "Clear All",
      addJSONRule: "Add JSON Rule",
      noCustomRulesForm: 'Click "Add Custom Rule" to start creating rules',
      noCustomRulesJSON: 'Click "Add JSON Rule" to start creating rules',
      confirmClearAllRules: "Are you sure you want to clear all custom rules?",
      noFormRulesToConvert: "No form rules to convert",
      noValidJSONToConvert: "No valid JSON rules to convert",
      convertedFromForm: "Converted from Form",
      convertedFromJSON: "Converted from JSON",
      mustBeArray: "Must be an array format",
      nameRequired: "Rule name is required",
      invalidJSON: "Invalid JSON format",
      allJSONValid: "All JSON rules are valid!",
      jsonValidationErrors: "JSON validation errors",
      outboundNames: {
        "Auto Select": "\u26A1 Auto Select",
        "Node Select": "\u{1F680} Node Select",
        "Fall Back": "\u{1F41F} Fall Back",
        "Ad Block": "\u{1F6D1} Ad Blocking",
        "AI Services": "\u{1F4AC} AI Services",
        "Bilibili": "\u{1F4FA} Bilibili",
        "Youtube": "\u{1F4F9} Youtube",
        "Google": "\u{1F50D} Google Services",
        "Private": "\u{1F3E0} Private Network",
        "Location:CN": "\u{1F512} China Services",
        "Telegram": "\u{1F4F2} Telegram",
        "Github": "\u{1F431} Github",
        "Microsoft": "\u24C2\uFE0F Microsoft Services",
        "Apple": "\u{1F34F} Apple Services",
        "Social Media": "\u{1F310} Social Media",
        "Streaming": "\u{1F3AC} Streaming",
        "Gaming": "\u{1F3AE} Gaming Platform",
        "Education": "\u{1F4DA} Education Resources",
        "Financial": "\u{1F4B0} Financial Services",
        "Cloud Services": "\u2601\uFE0F Cloud Services",
        "Non-China": "\u{1F310} Non-China",
        "GLOBAL": "GLOBAL"
      },
      UASettings: "Custom UserAgent",
      UAtip: "By default it will use curl/7.74.0"
    },
    "fa": {
      missingInput: "\u067E\u0627\u0631\u0627\u0645\u062A\u0631 \u0648\u0631\u0648\u062F\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",
      missingConfig: "\u067E\u0627\u0631\u0627\u0645\u062A\u0631 \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",
      missingUrl: "\u067E\u0627\u0631\u0627\u0645\u062A\u0631 URL \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",
      shortUrlNotFound: "\u0644\u06CC\u0646\u06A9 \u06A9\u0648\u062A\u0627\u0647 \u067E\u06CC\u062F\u0627 \u0646\u0634\u062F",
      invalidShortUrl: "\u0644\u06CC\u0646\u06A9 \u06A9\u0648\u062A\u0627\u0647 \u0646\u0627\u0645\u0639\u062A\u0628\u0631",
      internalError: "\u062E\u0637\u0627\u06CC \u062F\u0627\u062E\u0644\u06CC \u0633\u0631\u0648\u0631",
      notFound: "\u06CC\u0627\u0641\u062A \u0646\u0634\u062F",
      invalidFormat: "\u0641\u0631\u0645\u062A \u0646\u0627\u0645\u0639\u062A\u0628\u0631: ",
      defaultRules: ["\u0645\u0633\u062F\u0648\u062F\u0633\u0627\u0632\u06CC \u062A\u0628\u0644\u06CC\u063A\u0627\u062A", "\u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u06AF\u0648\u06AF\u0644", "\u0631\u0633\u0627\u0646\u0647\u200C\u0647\u0627\u06CC \u062E\u0627\u0631\u062C\u06CC", "\u062A\u0644\u06AF\u0631\u0627\u0645"],
      configValidationError: "\u062E\u0637\u0627\u06CC \u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC: ",
      pageDescription: "Sublink Worker - \u0645\u0628\u062F\u0644 \u0644\u06CC\u0646\u06A9 \u0627\u0634\u062A\u0631\u0627\u06A9",
      pageKeywords: "\u0644\u06CC\u0646\u06A9 \u0627\u0634\u062A\u0631\u0627\u06A9,\u0645\u0628\u062F\u0644,Xray,SingBox,Clash,Surge",
      pageTitle: "Sublink Worker - \u0645\u0628\u062F\u0644 \u0644\u06CC\u0646\u06A9 \u0627\u0634\u062A\u0631\u0627\u06A9",
      ogTitle: "Sublink Worker - \u0645\u0628\u062F\u0644 \u0644\u06CC\u0646\u06A9 \u0627\u0634\u062A\u0631\u0627\u06A9",
      ogDescription: "\u06CC\u06A9 \u0645\u0628\u062F\u0644 \u0642\u062F\u0631\u062A\u0645\u0646\u062F \u0644\u06CC\u0646\u06A9 \u0627\u0634\u062A\u0631\u0627\u06A9 \u0628\u0627 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0627\u0632 \u0641\u0631\u0645\u062A\u200C\u0647\u0627\u06CC \u0645\u062E\u062A\u0644\u0641",
      shareUrls: "\u0627\u0634\u062A\u0631\u0627\u06A9\u200C\u06AF\u0630\u0627\u0631\u06CC \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627",
      urlPlaceholder: "\u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u0627\u0634\u062A\u0631\u0627\u06A9 \u062E\u0648\u062F \u0631\u0627 \u0627\u06CC\u0646\u062C\u0627 \u0648\u0627\u0631\u062F \u06A9\u0646\u06CC\u062F (\u0628\u0631\u0627\u06CC \u062A\u062C\u0632\u06CC\u0647 \u0633\u0631\u06CC\u0639 \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC\u060C \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u062A\u0648\u0644\u06CC\u062F \u0634\u062F\u0647 \u0642\u0628\u0644\u06CC \u0631\u0627 \u062C\u0627\u06CC\u06AF\u0630\u0627\u0631\u06CC \u06A9\u0646\u06CC\u062F)...",
      advancedOptions: "\u06AF\u0632\u06CC\u0646\u0647\u200C\u0647\u0627\u06CC \u067E\u06CC\u0634\u0631\u0641\u062A\u0647",
      baseConfigSettings: "\u062A\u0646\u0638\u06CC\u0645\u0627\u062A \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC \u067E\u0627\u06CC\u0647",
      baseConfigTooltip: "\u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC \u067E\u0627\u06CC\u0647 \u062E\u0648\u062F \u0631\u0627 \u0627\u06CC\u0646\u062C\u0627 \u0633\u0641\u0627\u0631\u0634\u06CC \u06A9\u0646\u06CC\u062F",
      saveConfig: "\u0630\u062E\u06CC\u0631\u0647 \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC",
      clearConfig: "\u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u067E\u06CC\u06A9\u0631\u0628\u0646\u062F\u06CC",
      convert: "\u062A\u0628\u062F\u06CC\u0644",
      clear: "\u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646",
      customPath: "\u0645\u0633\u06CC\u0631 \u0633\u0641\u0627\u0631\u0634\u06CC",
      savedPaths: "\u0645\u0633\u06CC\u0631\u0647\u0627\u06CC \u0630\u062E\u06CC\u0631\u0647 \u0634\u062F\u0647",
      shortenLinks: "\u0627\u06CC\u062C\u0627\u062F \u0644\u06CC\u0646\u06A9\u200C\u0647\u0627\u06CC \u06A9\u0648\u062A\u0627\u0647",
      ruleSelection: "\u0627\u0646\u062A\u062E\u0627\u0628 \u0642\u0648\u0627\u0646\u06CC\u0646",
      ruleSelectionTooltip: "\u0645\u062C\u0645\u0648\u0639\u0647 \u0642\u0648\u0627\u0646\u06CC\u0646 \u0645\u0648\u0631\u062F \u0646\u0638\u0631 \u062E\u0648\u062F \u0631\u0627 \u0627\u0646\u062A\u062E\u0627\u0628 \u06A9\u0646\u06CC\u062F",
      custom: "\u0633\u0641\u0627\u0631\u0634\u06CC",
      minimal: "\u062D\u062F\u0627\u0642\u0644",
      balanced: "\u0645\u062A\u0639\u0627\u062F\u0644",
      comprehensive: "\u062C\u0627\u0645\u0639",
      addCustomRule: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0642\u0627\u0646\u0648\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC",
      customRuleOutboundName: "\u0646\u0627\u0645 \u062E\u0631\u0648\u062C\u06CC*",
      customRuleGeoSite: "\u0642\u0648\u0627\u0646\u06CC\u0646 Geo-Site",
      customRuleGeoSiteTooltip: "\u0642\u0648\u0627\u0646\u06CC\u0646 SingBox Site \u0627\u0632 https://github.com/lyc8503/sing-box-rules \u0645\u06CC\u200C\u0622\u06CC\u0646\u062F\u060C \u0628\u0647 \u0627\u06CC\u0646 \u0645\u0639\u0646\u06CC \u06A9\u0647 \u0642\u0648\u0627\u0646\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC \u0634\u0645\u0627 \u0628\u0627\u06CC\u062F \u062F\u0631 \u0622\u0646 \u0645\u062E\u0632\u0646 \u0628\u0627\u0634\u062F",
      customRuleGeoSitePlaceholder: "\u0628\u0631\u0627\u06CC \u0645\u062B\u0627\u0644: google,anthropic",
      customRuleGeoIP: "\u0642\u0648\u0627\u0646\u06CC\u0646 Geo-IP",
      customRuleGeoIPTooltip: "\u0642\u0648\u0627\u0646\u06CC\u0646 SingBox IP \u0627\u0632 https://github.com/lyc8503/sing-box-rules \u0645\u06CC\u200C\u0622\u06CC\u0646\u062F\u060C \u0628\u0647 \u0627\u06CC\u0646 \u0645\u0639\u0646\u06CC \u06A9\u0647 \u0642\u0648\u0627\u0646\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC \u0634\u0645\u0627 \u0628\u0627\u06CC\u062F \u062F\u0631 \u0622\u0646 \u0645\u062E\u0632\u0646 \u0628\u0627\u0634\u062F",
      customRuleGeoIPPlaceholder: "\u0628\u0631\u0627\u06CC \u0645\u062B\u0627\u0644: private,cn",
      customRuleDomainSuffix: "\u067E\u0633\u0648\u0646\u062F \u062F\u0627\u0645\u0646\u0647",
      customRuleDomainSuffixPlaceholder: "\u067E\u0633\u0648\u0646\u062F\u0647\u0627\u06CC \u062F\u0627\u0645\u0646\u0647 (\u0628\u0627 \u06A9\u0627\u0645\u0627 \u062C\u062F\u0627 \u0634\u062F\u0647)",
      customRuleDomainKeyword: "\u06A9\u0644\u0645\u0647 \u06A9\u0644\u06CC\u062F\u06CC \u062F\u0627\u0645\u0646\u0647",
      customRuleDomainKeywordPlaceholder: "\u06A9\u0644\u0645\u0627\u062A \u06A9\u0644\u06CC\u062F\u06CC \u062F\u0627\u0645\u0646\u0647 (\u0628\u0627 \u06A9\u0627\u0645\u0627 \u062C\u062F\u0627 \u0634\u062F\u0647)",
      customRuleIPCIDR: "IP CIDR",
      customRuleIPCIDRPlaceholder: "IP CIDR (\u0628\u0627 \u06A9\u0627\u0645\u0627 \u062C\u062F\u0627 \u0634\u062F\u0647)",
      customRuleProtocol: "\u0646\u0648\u0639 \u067E\u0631\u0648\u062A\u06A9\u0644",
      customRuleProtocolTooltip: "\u0642\u0648\u0627\u0646\u06CC\u0646 \u067E\u0631\u0648\u062A\u06A9\u0644 \u0628\u0631\u0627\u06CC \u0627\u0646\u0648\u0627\u0639 \u062E\u0627\u0635 \u062A\u0631\u0627\u0641\u06CC\u06A9. \u062C\u0632\u0626\u06CC\u0627\u062A \u0628\u06CC\u0634\u062A\u0631: https://sing-box.sagernet.org/configuration/route/sniff/",
      customRuleProtocolPlaceholder: "\u067E\u0631\u0648\u062A\u06A9\u0644\u200C\u0647\u0627 (\u0628\u0627 \u06A9\u0627\u0645\u0627 \u062C\u062F\u0627 \u0634\u062F\u0647\u060C \u0645\u062B\u0644\u0627\u064B: http,ssh,dns)",
      removeCustomRule: "\u062D\u0630\u0641",
      addCustomRuleJSON: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0642\u0627\u0646\u0648\u0646 JSON",
      customRuleJSON: "\u0642\u0627\u0646\u0648\u0646 JSON",
      customRuleJSONTooltip: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0642\u0648\u0627\u0646\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC \u0628\u0627 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0627\u0632 \u0641\u0631\u0645\u062A JSON\u060C \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0627\u0632 \u0627\u0641\u0632\u0648\u062F\u0646 \u062F\u0633\u062A\u0647\u200C\u0627\u06CC",
      customRulesSection: "\u0642\u0648\u0627\u0646\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC",
      customRulesSectionTooltip: "\u0642\u0648\u0627\u0646\u06CC\u0646 \u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u0633\u0641\u0627\u0631\u0634\u06CC \u0628\u0631\u0627\u06CC \u06A9\u0646\u062A\u0631\u0644 \u0631\u0641\u062A\u0627\u0631 \u0645\u0633\u06CC\u0631\u06CC\u0627\u0628\u06CC \u062A\u0631\u0627\u0641\u06CC\u06A9 \u0627\u06CC\u062C\u0627\u062F \u06A9\u0646\u06CC\u062F. \u0627\u0632 \u062D\u0627\u0644\u062A\u200C\u0647\u0627\u06CC \u0648\u06CC\u0631\u0627\u06CC\u0634 \u0641\u0631\u0645 \u0648 JSON \u0628\u0627 \u062A\u0628\u062F\u06CC\u0644 \u062F\u0648\u0637\u0631\u0641\u0647 \u067E\u0634\u062A\u06CC\u0628\u0627\u0646\u06CC \u0645\u06CC\u200C\u06A9\u0646\u062F.",
      customRulesForm: "\u0646\u0645\u0627\u06CC \u0641\u0631\u0645",
      customRulesJSON: "\u0646\u0645\u0627\u06CC JSON",
      customRule: "\u0642\u0627\u0646\u0648\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC",
      convertToJSON: "\u062A\u0628\u062F\u06CC\u0644 \u0628\u0647 JSON",
      convertToForm: "\u062A\u0628\u062F\u06CC\u0644 \u0628\u0647 \u0641\u0631\u0645",
      validateJSON: "\u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC JSON",
      clearAll: "\u067E\u0627\u06A9 \u06A9\u0631\u062F\u0646 \u0647\u0645\u0647",
      addJSONRule: "\u0627\u0641\u0632\u0648\u062F\u0646 \u0642\u0627\u0646\u0648\u0646 JSON",
      noCustomRulesForm: '\u0631\u0648\u06CC "\u0627\u0641\u0632\u0648\u062F\u0646 \u0642\u0627\u0646\u0648\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC" \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u0634\u0631\u0648\u0639 \u0628\u0647 \u0627\u06CC\u062C\u0627\u062F \u0642\u0648\u0627\u0646\u06CC\u0646 \u06A9\u0646\u06CC\u062F',
      noCustomRulesJSON: '\u0631\u0648\u06CC "\u0627\u0641\u0632\u0648\u062F\u0646 \u0642\u0627\u0646\u0648\u0646 JSON" \u06A9\u0644\u06CC\u06A9 \u06A9\u0646\u06CC\u062F \u062A\u0627 \u0634\u0631\u0648\u0639 \u0628\u0647 \u0627\u06CC\u062C\u0627\u062F \u0642\u0648\u0627\u0646\u06CC\u0646 \u06A9\u0646\u06CC\u062F',
      confirmClearAllRules: "\u0622\u06CC\u0627 \u0645\u0637\u0645\u0626\u0646 \u0647\u0633\u062A\u06CC\u062F \u06A9\u0647 \u0645\u06CC\u200C\u062E\u0648\u0627\u0647\u06CC\u062F \u0647\u0645\u0647 \u0642\u0648\u0627\u0646\u06CC\u0646 \u0633\u0641\u0627\u0631\u0634\u06CC \u0631\u0627 \u067E\u0627\u06A9 \u06A9\u0646\u06CC\u062F\u061F",
      noFormRulesToConvert: "\u0647\u06CC\u0686 \u0642\u0627\u0646\u0648\u0646 \u0641\u0631\u0645\u06CC \u0628\u0631\u0627\u06CC \u062A\u0628\u062F\u06CC\u0644 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",
      noValidJSONToConvert: "\u0647\u06CC\u0686 \u0642\u0627\u0646\u0648\u0646 JSON \u0645\u0639\u062A\u0628\u0631\u06CC \u0628\u0631\u0627\u06CC \u062A\u0628\u062F\u06CC\u0644 \u0648\u062C\u0648\u062F \u0646\u062F\u0627\u0631\u062F",
      convertedFromForm: "\u0627\u0632 \u0641\u0631\u0645 \u062A\u0628\u062F\u06CC\u0644 \u0634\u062F\u0647",
      convertedFromJSON: "\u0627\u0632 JSON \u062A\u0628\u062F\u06CC\u0644 \u0634\u062F\u0647",
      mustBeArray: "\u0628\u0627\u06CC\u062F \u062F\u0631 \u0642\u0627\u0644\u0628 \u0622\u0631\u0627\u06CC\u0647 \u0628\u0627\u0634\u062F",
      nameRequired: "\u0646\u0627\u0645 \u0642\u0627\u0646\u0648\u0646 \u0627\u0644\u0632\u0627\u0645\u06CC \u0627\u0633\u062A",
      invalidJSON: "\u0641\u0631\u0645\u062A JSON \u0646\u0627\u0645\u0639\u062A\u0628\u0631",
      allJSONValid: "\u0647\u0645\u0647 \u0642\u0648\u0627\u0646\u06CC\u0646 JSON \u0645\u0639\u062A\u0628\u0631 \u0647\u0633\u062A\u0646\u062F!",
      jsonValidationErrors: "\u062E\u0637\u0627\u0647\u0627\u06CC \u0627\u0639\u062A\u0628\u0627\u0631\u0633\u0646\u062C\u06CC JSON",
      outboundNames: {
        "Auto Select": "\u26A1 \u0627\u0646\u062A\u062E\u0627\u0628 \u062E\u0648\u062F\u06A9\u0627\u0631",
        "Node Select": "\u{1F680} \u0627\u0646\u062A\u062E\u0627\u0628 \u0646\u0648\u062F",
        "Fall Back": "\u{1F41F} \u0641\u0627\u0644 \u0628\u06A9",
        "Ad Block": "\u{1F6D1} \u0645\u0633\u062F\u0648\u062F\u0633\u0627\u0632\u06CC \u062A\u0628\u0644\u06CC\u063A\u0627\u062A",
        "AI Services": "\u{1F4AC} \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u0647\u0648\u0634 \u0645\u0635\u0646\u0648\u0639\u06CC",
        "Bilibili": "\u{1F4FA} \u0628\u06CC\u0644\u06CC\u200C\u0628\u06CC\u0644\u06CC",
        "Youtube": "\u{1F4F9} \u06CC\u0648\u062A\u06CC\u0648\u0628",
        "Google": "\u{1F50D} \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u06AF\u0648\u06AF\u0644",
        "Private": "\u{1F3E0} \u0634\u0628\u06A9\u0647 \u062E\u0635\u0648\u0635\u06CC",
        "Location:CN": "\u{1F512} \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u0686\u06CC\u0646",
        "Telegram": "\u{1F4F2} \u062A\u0644\u06AF\u0631\u0627\u0645",
        "Github": "\u{1F431} \u06AF\u06CC\u062A\u200C\u0647\u0627\u0628",
        "Microsoft": "\u24C2\uFE0F \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u0645\u0627\u06CC\u06A9\u0631\u0648\u0633\u0627\u0641\u062A",
        "Apple": "\u{1F34F} \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u0627\u067E\u0644",
        "Social Media": "\u{1F310} \u0634\u0628\u06A9\u0647\u200C\u0647\u0627\u06CC \u0627\u062C\u062A\u0645\u0627\u0639\u06CC",
        "Streaming": "\u{1F3AC} \u0627\u0633\u062A\u0631\u06CC\u0645\u06CC\u0646\u06AF",
        "Gaming": "\u{1F3AE} \u067E\u0644\u062A\u0641\u0631\u0645 \u0628\u0627\u0632\u06CC",
        "Education": "\u{1F4DA} \u0645\u0646\u0627\u0628\u0639 \u0622\u0645\u0648\u0632\u0634\u06CC",
        "Financial": "\u{1F4B0} \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u0645\u0627\u0644\u06CC",
        "Cloud Services": "\u2601\uFE0F \u0633\u0631\u0648\u06CC\u0633\u200C\u0647\u0627\u06CC \u0627\u0628\u0631\u06CC",
        "Non-China": "\u{1F310} \u062E\u0627\u0631\u062C \u0627\u0632 \u0686\u06CC\u0646",
        "GLOBAL": "GLOBAL"
      },
      UASettings: "UserAgent \u0633\u0641\u0627\u0631\u0634\u06CC",
      UAtip: "\u0628\u0647 \u0637\u0648\u0631 \u067E\u06CC\u0634\u200C\u0641\u0631\u0636 \u0627\u0632 curl/7.74.0 \u0627\u0633\u062A\u0641\u0627\u062F\u0647 \u0645\u06CC\u200C\u06A9\u0646\u062F"
    },
    "ru": {
      missingInput: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u0432\u0445\u043E\u0434\u043D\u043E\u0439 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440",
      missingConfig: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438",
      missingUrl: "\u041E\u0442\u0441\u0443\u0442\u0441\u0442\u0432\u0443\u0435\u0442 \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440 URL",
      shortUrlNotFound: "\u041A\u043E\u0440\u043E\u0442\u043A\u0430\u044F \u0441\u0441\u044B\u043B\u043A\u0430 \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430",
      invalidShortUrl: "\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u0430\u044F \u043A\u043E\u0440\u043E\u0442\u043A\u0430\u044F \u0441\u0441\u044B\u043B\u043A\u0430",
      internalError: "\u0412\u043D\u0443\u0442\u0440\u0435\u043D\u043D\u044F\u044F \u043E\u0448\u0438\u0431\u043A\u0430 \u0441\u0435\u0440\u0432\u0435\u0440\u0430",
      notFound: "\u041D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u043E",
      invalidFormat: "\u041D\u0435\u0434\u043E\u043F\u0443\u0441\u0442\u0438\u043C\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442: ",
      defaultRules: ["\u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430 \u0440\u0435\u043A\u043B\u0430\u043C\u044B", "\u0421\u0435\u0440\u0432\u0438\u0441\u044B Google", "\u0417\u0430\u0440\u0443\u0431\u0435\u0436\u043D\u044B\u0435 \u043C\u0435\u0434\u0438\u0430", "Telegram"],
      configValidationError: "\u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438: ",
      pageDescription: "Sublink Worker - \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442 \u0434\u043B\u044F \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u0441\u044B\u043B\u043E\u043A \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438",
      pageKeywords: "\u0441\u0441\u044B\u043B\u043A\u0430 \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438,\u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435,Xray,SingBox,Clash,Surge",
      pageTitle: "Sublink Worker - \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442 \u0434\u043B\u044F \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u0441\u044B\u043B\u043E\u043A \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438",
      ogTitle: "Sublink Worker - \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442 \u0434\u043B\u044F \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u0441\u044B\u043B\u043E\u043A \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438",
      ogDescription: "\u041C\u043E\u0449\u043D\u044B\u0439 \u0438\u043D\u0441\u0442\u0440\u0443\u043C\u0435\u043D\u0442 \u0434\u043B\u044F \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u044F \u0441\u0441\u044B\u043B\u043E\u043A \u043F\u043E\u0434\u043F\u0438\u0441\u043A\u0438, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u044E\u0449\u0438\u0439 \u0440\u0430\u0437\u043B\u0438\u0447\u043D\u044B\u0435 \u0444\u043E\u0440\u043C\u0430\u0442\u044B \u043A\u043B\u0438\u0435\u043D\u0442\u043E\u0432",
      shareUrls: "\u041F\u043E\u0434\u0435\u043B\u0438\u0442\u044C\u0441\u044F \u0441\u0441\u044B\u043B\u043A\u0430\u043C\u0438",
      urlPlaceholder: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u0437\u0434\u0435\u0441\u044C \u0432\u0430\u0448\u0438 \u0441\u0441\u044B\u043B\u043A\u0438 (\u0432\u0441\u0442\u0430\u0432\u044C\u0442\u0435 \u0440\u0430\u043D\u0435\u0435 \u0441\u043E\u0437\u0434\u0430\u043D\u043D\u044B\u0435 \u0441\u0441\u044B\u043B\u043A\u0438 \u0434\u043B\u044F \u0431\u044B\u0441\u0442\u0440\u043E\u0433\u043E \u0440\u0430\u0437\u0431\u043E\u0440\u0430 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438)...",
      advancedOptions: "\u0420\u0430\u0441\u0448\u0438\u0440\u0435\u043D\u043D\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438",
      baseConfigSettings: "\u0411\u0430\u0437\u043E\u0432\u044B\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u0438",
      baseConfigTooltip: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u0442\u0435 \u0431\u0430\u0437\u043E\u0432\u0443\u044E \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E \u0437\u0434\u0435\u0441\u044C",
      saveConfig: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E",
      clearConfig: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u043A\u043E\u043D\u0444\u0438\u0433\u0443\u0440\u0430\u0446\u0438\u044E",
      convert: "\u041F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u0442\u044C",
      clear: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C",
      customPath: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 \u043F\u0443\u0442\u044C",
      savedPaths: "\u0421\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0435 \u043F\u0443\u0442\u0438",
      shortenLinks: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C \u043A\u043E\u0440\u043E\u0442\u043A\u0438\u0435 \u0441\u0441\u044B\u043B\u043A\u0438",
      ruleSelection: "\u0412\u044B\u0431\u043E\u0440 \u043F\u0440\u0430\u0432\u0438\u043B",
      ruleSelectionTooltip: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043D\u0443\u0436\u043D\u044B\u0435 \u043D\u0430\u0431\u043E\u0440\u044B \u043F\u0440\u0430\u0432\u0438\u043B",
      custom: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439",
      minimal: "\u041C\u0438\u043D\u0438\u043C\u0430\u043B\u044C\u043D\u044B\u0439",
      balanced: "\u0421\u0431\u0430\u043B\u0430\u043D\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043D\u044B\u0439",
      comprehensive: "\u041F\u043E\u043B\u043D\u044B\u0439",
      addCustomRule: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
      customRuleOutboundName: "\u0418\u043C\u044F \u0432\u044B\u0445\u043E\u0434\u0430*",
      customRuleGeoSite: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 Geo-Site",
      customRuleGeoSiteTooltip: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 Site \u0432 SingBox \u0431\u0435\u0440\u0443\u0442\u0441\u044F \u0438\u0437 https://github.com/lyc8503/sing-box-rules, \u0437\u043D\u0430\u0447\u0438\u0442 \u0432\u0430\u0448\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u0432 \u044D\u0442\u043E\u043C \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0438",
      customRuleGeoSitePlaceholder: "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: google,anthropic",
      customRuleGeoIP: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 Geo-IP",
      customRuleGeoIPTooltip: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 IP \u0432 SingBox \u0431\u0435\u0440\u0443\u0442\u0441\u044F \u0438\u0437 https://github.com/lyc8503/sing-box-rules, \u0437\u043D\u0430\u0447\u0438\u0442 \u0432\u0430\u0448\u0438 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u0434\u043E\u043B\u0436\u043D\u044B \u0431\u044B\u0442\u044C \u0432 \u044D\u0442\u043E\u043C \u0440\u0435\u043F\u043E\u0437\u0438\u0442\u043E\u0440\u0438\u0438",
      customRuleGeoIPPlaceholder: "\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: private,cn",
      customRuleDomainSuffix: "\u0421\u0443\u0444\u0444\u0438\u043A\u0441 \u0434\u043E\u043C\u0435\u043D\u0430",
      customRuleDomainSuffixPlaceholder: "\u0421\u0443\u0444\u0444\u0438\u043A\u0441\u044B \u0434\u043E\u043C\u0435\u043D\u0430 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)",
      customRuleDomainKeyword: "\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0441\u043B\u043E\u0432\u0430 \u0434\u043E\u043C\u0435\u043D\u0430",
      customRuleDomainKeywordPlaceholder: "\u041A\u043B\u044E\u0447\u0435\u0432\u044B\u0435 \u0441\u043B\u043E\u0432\u0430 \u0434\u043E\u043C\u0435\u043D\u0430 (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)",
      customRuleIPCIDR: "IP CIDR",
      customRuleIPCIDRPlaceholder: "IP CIDR (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E)",
      customRuleProtocol: "\u0422\u0438\u043F \u043F\u0440\u043E\u0442\u043E\u043A\u043E\u043B\u0430",
      customRuleProtocolTooltip: "\u041F\u0440\u0430\u0432\u0438\u043B\u0430 \u0434\u043B\u044F \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u0451\u043D\u043D\u044B\u0445 \u0442\u0438\u043F\u043E\u0432 \u0442\u0440\u0430\u0444\u0438\u043A\u0430. \u041F\u043E\u0434\u0440\u043E\u0431\u043D\u0435\u0435: https://sing-box.sagernet.org/configuration/route/sniff/",
      customRuleProtocolPlaceholder: "\u041F\u0440\u043E\u0442\u043E\u043A\u043E\u043B\u044B (\u0447\u0435\u0440\u0435\u0437 \u0437\u0430\u043F\u044F\u0442\u0443\u044E, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440: http,ssh,dns)",
      removeCustomRule: "\u0423\u0434\u0430\u043B\u0438\u0442\u044C",
      addCustomRuleJSON: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E JSON",
      customRuleJSON: "\u041F\u0440\u0430\u0432\u0438\u043B\u043E JSON",
      customRuleJSONTooltip: "\u0414\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0445 \u043F\u0440\u0430\u0432\u0438\u043B \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 JSON, \u043F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u043F\u0430\u043A\u0435\u0442\u043D\u043E\u0435 \u0434\u043E\u0431\u0430\u0432\u043B\u0435\u043D\u0438\u0435",
      customRulesSection: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430",
      customRulesSectionTooltip: "\u0421\u043E\u0437\u0434\u0430\u0432\u0430\u0439\u0442\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u0438 \u0434\u043B\u044F \u0443\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u0438\u044F \u043F\u043E\u0432\u0435\u0434\u0435\u043D\u0438\u0435\u043C \u043C\u0430\u0440\u0448\u0440\u0443\u0442\u0438\u0437\u0430\u0446\u0438\u0438 \u0442\u0440\u0430\u0444\u0438\u043A\u0430. \u041F\u043E\u0434\u0434\u0435\u0440\u0436\u0438\u0432\u0430\u0435\u0442 \u0440\u0435\u0436\u0438\u043C\u044B \u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u0438\u044F \u0444\u043E\u0440\u043C\u044B \u0438 JSON \u0441 \u0434\u0432\u0443\u043D\u0430\u043F\u0440\u0430\u0432\u043B\u0435\u043D\u043D\u044B\u043C \u043F\u0440\u0435\u043E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u043D\u0438\u0435\u043C.",
      customRulesForm: "\u0412\u0438\u0434 \u0444\u043E\u0440\u043C\u044B",
      customRulesJSON: "\u0412\u0438\u0434 JSON",
      customRule: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E",
      convertToJSON: "\u041A\u043E\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432 JSON",
      convertToForm: "\u041A\u043E\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0443",
      validateJSON: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C JSON",
      clearAll: "\u041E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0451",
      addJSONRule: "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E JSON",
      noCustomRulesForm: '\u041D\u0430\u0436\u043C\u0438\u0442\u0435 "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u043E\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u043E" \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B',
      noCustomRulesJSON: '\u041D\u0430\u0436\u043C\u0438\u0442\u0435 "\u0414\u043E\u0431\u0430\u0432\u0438\u0442\u044C \u043F\u0440\u0430\u0432\u0438\u043B\u043E JSON" \u0447\u0442\u043E\u0431\u044B \u043D\u0430\u0447\u0430\u0442\u044C \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B',
      confirmClearAllRules: "\u0412\u044B \u0443\u0432\u0435\u0440\u0435\u043D\u044B, \u0447\u0442\u043E \u0445\u043E\u0442\u0438\u0442\u0435 \u043E\u0447\u0438\u0441\u0442\u0438\u0442\u044C \u0432\u0441\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430?",
      noFormRulesToConvert: "\u041D\u0435\u0442 \u043F\u0440\u0430\u0432\u0438\u043B \u0444\u043E\u0440\u043C\u044B \u0434\u043B\u044F \u043A\u043E\u043D\u0432\u0435\u0440\u0442\u0430\u0446\u0438\u0438",
      noValidJSONToConvert: "\u041D\u0435\u0442 \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0445 \u043F\u0440\u0430\u0432\u0438\u043B JSON \u0434\u043B\u044F \u043A\u043E\u043D\u0432\u0435\u0440\u0442\u0430\u0446\u0438\u0438",
      convertedFromForm: "\u041A\u043E\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0438\u0437 \u0444\u043E\u0440\u043C\u044B",
      convertedFromJSON: "\u041A\u043E\u043D\u0432\u0435\u0440\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E \u0438\u0437 JSON",
      mustBeArray: "\u0414\u043E\u043B\u0436\u043D\u043E \u0431\u044B\u0442\u044C \u0432 \u0444\u043E\u0440\u043C\u0430\u0442\u0435 \u043C\u0430\u0441\u0441\u0438\u0432\u0430",
      nameRequired: "\u0418\u043C\u044F \u043F\u0440\u0430\u0432\u0438\u043B\u0430 \u043E\u0431\u044F\u0437\u0430\u0442\u0435\u043B\u044C\u043D\u043E",
      invalidJSON: "\u041D\u0435\u0432\u0435\u0440\u043D\u044B\u0439 \u0444\u043E\u0440\u043C\u0430\u0442 JSON",
      allJSONValid: "\u0412\u0441\u0435 \u043F\u0440\u0430\u0432\u0438\u043B\u0430 JSON \u0434\u0435\u0439\u0441\u0442\u0432\u0438\u0442\u0435\u043B\u044C\u043D\u044B!",
      jsonValidationErrors: "\u041E\u0448\u0438\u0431\u043A\u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u043A\u0438 JSON",
      outboundNames: {
        "Auto Select": "\u26A1 \u0410\u0432\u0442\u043E\u0432\u044B\u0431\u043E\u0440",
        "Node Select": "\u{1F680} \u0412\u044B\u0431\u043E\u0440 \u0443\u0437\u043B\u0430",
        "Fall Back": "\u{1F41F} \u0420\u0435\u0437\u0435\u0440\u0432",
        "Ad Block": "\u{1F6D1} \u0411\u043B\u043E\u043A\u0438\u0440\u043E\u0432\u043A\u0430 \u0440\u0435\u043A\u043B\u0430\u043C\u044B",
        "AI Services": "\u{1F4AC} AI-\u0441\u0435\u0440\u0432\u0438\u0441\u044B",
        "Bilibili": "\u{1F4FA} Bilibili",
        "Youtube": "\u{1F4F9} YouTube",
        "Google": "\u{1F50D} \u0421\u0435\u0440\u0432\u0438\u0441\u044B Google",
        "Private": "\u{1F3E0} \u041B\u043E\u043A\u0430\u043B\u044C\u043D\u0430\u044F \u0441\u0435\u0442\u044C",
        "Location:CN": "\u{1F512} \u0421\u0435\u0440\u0432\u0438\u0441\u044B \u041A\u0438\u0442\u0430\u044F",
        "Telegram": "\u{1F4F2} Telegram",
        "Github": "\u{1F431} GitHub",
        "Microsoft": "\u24C2\uFE0F \u0421\u0435\u0440\u0432\u0438\u0441\u044B Microsoft",
        "Apple": "\u{1F34F} \u0421\u0435\u0440\u0432\u0438\u0441\u044B Apple",
        "Social Media": "\u{1F310} \u0421\u043E\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0435 \u0441\u0435\u0442\u0438",
        "Streaming": "\u{1F3AC} \u0421\u0442\u0440\u0438\u043C\u0438\u043D\u0433",
        "Gaming": "\u{1F3AE} \u0418\u0433\u0440\u043E\u0432\u044B\u0435 \u043F\u043B\u0430\u0442\u0444\u043E\u0440\u043C\u044B",
        "Education": "\u{1F4DA} \u041E\u0431\u0440\u0430\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0440\u0435\u0441\u0443\u0440\u0441\u044B",
        "Financial": "\u{1F4B0} \u0424\u0438\u043D\u0430\u043D\u0441\u043E\u0432\u044B\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u044B",
        "Cloud Services": "\u2601\uFE0F \u041E\u0431\u043B\u0430\u0447\u043D\u044B\u0435 \u0441\u0435\u0440\u0432\u0438\u0441\u044B",
        "Non-China": "\u{1F310} \u0417\u0430 \u043F\u0440\u0435\u0434\u0435\u043B\u0430\u043C\u0438 \u041A\u0438\u0442\u0430\u044F",
        "GLOBAL": "GLOBAL"
      },
      UASettings: "\u041F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044C\u0441\u043A\u0438\u0439 UserAgent",
      UAtip: "\u041F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u0442\u0441\u044F curl/7.74.0"
    }
  };
  var currentLang = "zh-CN";
  function setLanguage(lang) {
    if (translations[lang]) {
      currentLang = lang;
    } else if (checkStartsWith(lang, "en")) {
      currentLang = "en-US";
    } else if (checkStartsWith(lang, "fa")) {
      currentLang = "fa";
    } else if (checkStartsWith(lang, "ru")) {
      currentLang = "ru";
    } else {
      currentLang = "zh-CN";
    }
  }
  __name(setLanguage, "setLanguage");
  function t(key) {
    const keys = key.split(".");
    let value = translations[currentLang];
    for (const k of keys) {
      value = value?.[k];
      if (value === void 0) {
        if (checkStartsWith(key, "outboundNames.")) {
          return key.split(".")[1];
        }
        return key;
      }
    }
    return value;
  }
  __name(t, "t");

  // src/config.js
  var SITE_RULE_SET_BASE_URL = "https://gh-proxy.com/https://raw.githubusercontent.com/lyc8503/sing-box-rules/refs/heads/rule-set-geosite/";
  var IP_RULE_SET_BASE_URL = "https://gh-proxy.com/https://raw.githubusercontent.com/lyc8503/sing-box-rules/refs/heads/rule-set-geoip/";
  var CLASH_SITE_RULE_SET_BASE_URL = "https://gh-proxy.com/https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geosite/";
  var CLASH_IP_RULE_SET_BASE_URL = "https://gh-proxy.com/https://github.com/MetaCubeX/meta-rules-dat/raw/refs/heads/meta/geo/geoip/";
  var SURGE_SITE_RULE_SET_BASEURL = "https://gh-proxy.com/https://github.com/NSZA156/surge-geox-rules/raw/refs/heads/release/geo/geosite/";
  var SURGE_IP_RULE_SET_BASEURL = "https://gh-proxy.com/https://github.com/NSZA156/surge-geox-rules/raw/refs/heads/release/geo/geoip/";
  var UNIFIED_RULES = [
    {
      name: "Ad Block",
      outbound: t("outboundNames.Ad Block"),
      site_rules: ["category-ads-all"],
      ip_rules: []
    },
    {
      name: "AI Services",
      outbound: t("outboundNames.AI Services"),
      site_rules: ["category-ai-!cn"],
      ip_rules: []
    },
    {
      name: "Bilibili",
      outbound: t("outboundNames.Bilibili"),
      site_rules: ["bilibili"],
      ip_rules: []
    },
    {
      name: "Youtube",
      outbound: t("outboundNames.Youtube"),
      site_rules: ["youtube"],
      ip_rules: []
    },
    {
      name: "Google",
      outbound: t("outboundNames.Google"),
      site_rules: ["google"],
      ip_rules: ["google"]
    },
    {
      name: "Private",
      outbound: t("outboundNames.Private"),
      site_rules: [],
      ip_rules: ["private"]
    },
    {
      name: "Location:CN",
      outbound: t("outboundNames.Location:CN"),
      site_rules: ["geolocation-cn", "cn"],
      ip_rules: ["cn"]
    },
    {
      name: "Telegram",
      outbound: t("outboundNames.Telegram"),
      site_rules: [],
      ip_rules: ["telegram"]
    },
    {
      name: "Github",
      outbound: t("outboundNames.Github"),
      site_rules: ["github", "gitlab"],
      ip_rules: []
    },
    {
      name: "Microsoft",
      outbound: t("outboundNames.Microsoft"),
      site_rules: ["microsoft"],
      ip_rules: []
    },
    {
      name: "Apple",
      outbound: t("outboundNames.Apple"),
      site_rules: ["apple"],
      ip_rules: []
    },
    {
      name: "Social Media",
      outbound: t("outboundNames.Social Media"),
      site_rules: ["facebook", "instagram", "twitter", "tiktok", "linkedin"],
      ip_rules: []
    },
    {
      name: "Streaming",
      outbound: t("outboundNames.Streaming"),
      site_rules: ["netflix", "hulu", "disney", "hbo", "amazon", "bahamut"],
      ip_rules: []
    },
    {
      name: "Gaming",
      outbound: t("outboundNames.Gaming"),
      site_rules: ["steam", "epicgames", "ea", "ubisoft", "blizzard"],
      ip_rules: []
    },
    {
      name: "Education",
      outbound: t("outboundNames.Education"),
      site_rules: ["coursera", "edx", "udemy", "khanacademy", "category-scholar-!cn"],
      ip_rules: []
    },
    {
      name: "Financial",
      outbound: t("outboundNames.Financial"),
      site_rules: ["paypal", "visa", "mastercard", "stripe", "wise"],
      ip_rules: []
    },
    {
      name: "Cloud Services",
      outbound: t("outboundNames.Cloud Services"),
      site_rules: ["aws", "azure", "digitalocean", "heroku", "dropbox"],
      ip_rules: []
    },
    {
      name: "Non-China",
      outbound: t("outboundNames.Non-China"),
      site_rules: ["geolocation-!cn"],
      ip_rules: []
    }
  ];
  var PREDEFINED_RULE_SETS = {
    minimal: ["Location:CN", "Private", "Non-China"],
    balanced: ["Location:CN", "Private", "Non-China", "Github", "Google", "Youtube", "AI Services", "Telegram"],
    comprehensive: UNIFIED_RULES.map((rule) => rule.name)
  };
  var SITE_RULE_SETS = UNIFIED_RULES.reduce((acc, rule) => {
    rule.site_rules.forEach((site_rule) => {
      acc[site_rule] = `geosite-${site_rule}.srs`;
    });
    return acc;
  }, {});
  var IP_RULE_SETS = UNIFIED_RULES.reduce((acc, rule) => {
    rule.ip_rules.forEach((ip_rule) => {
      acc[ip_rule] = `geoip-${ip_rule}.srs`;
    });
    return acc;
  }, {});
  var CLASH_SITE_RULE_SETS = UNIFIED_RULES.reduce((acc, rule) => {
    rule.site_rules.forEach((site_rule) => {
      acc[site_rule] = `${site_rule}.mrs`;
    });
    return acc;
  }, {});
  var CLASH_IP_RULE_SETS = UNIFIED_RULES.reduce((acc, rule) => {
    rule.ip_rules.forEach((ip_rule) => {
      acc[ip_rule] = `${ip_rule}.mrs`;
    });
    return acc;
  }, {});
  function getOutbounds(selectedRuleNames) {
    if (!selectedRuleNames || !Array.isArray(selectedRuleNames)) {
      return [];
    }
    return UNIFIED_RULES.filter((rule) => selectedRuleNames.includes(rule.name)).map((rule) => rule.name);
  }
  __name(getOutbounds, "getOutbounds");
  function generateRules(selectedRules = [], customRules = []) {
    if (typeof selectedRules === "string" && PREDEFINED_RULE_SETS[selectedRules]) {
      selectedRules = PREDEFINED_RULE_SETS[selectedRules];
    }
    if (!selectedRules || selectedRules.length === 0) {
      selectedRules = PREDEFINED_RULE_SETS.minimal;
    }
    const rules = [];
    UNIFIED_RULES.forEach((rule) => {
      if (selectedRules.includes(rule.name)) {
        rules.push({
          site_rules: rule.site_rules,
          ip_rules: rule.ip_rules,
          domain_suffix: rule?.domain_suffix,
          ip_cidr: rule?.ip_cidr,
          outbound: rule.name
        });
      }
    });
    customRules.reverse();
    customRules.forEach((rule) => {
      rules.unshift({
        site_rules: rule.site.split(","),
        ip_rules: rule.ip.split(","),
        domain_suffix: rule.domain_suffix ? rule.domain_suffix.split(",") : [],
        domain_keyword: rule.domain_keyword ? rule.domain_keyword.split(",") : [],
        ip_cidr: rule.ip_cidr ? rule.ip_cidr.split(",") : [],
        protocol: rule.protocol ? rule.protocol.split(",") : [],
        outbound: rule.name
      });
    });
    return rules;
  }
  __name(generateRules, "generateRules");
  function generateRuleSets(selectedRules = [], customRules = []) {
    if (typeof selectedRules === "string" && PREDEFINED_RULE_SETS[selectedRules]) {
      selectedRules = PREDEFINED_RULE_SETS[selectedRules];
    }
    if (!selectedRules || selectedRules.length === 0) {
      selectedRules = PREDEFINED_RULE_SETS.minimal;
    }
    const selectedRulesSet = new Set(selectedRules);
    const siteRuleSets = /* @__PURE__ */ new Set();
    const ipRuleSets = /* @__PURE__ */ new Set();
    const ruleSets = [];
    UNIFIED_RULES.forEach((rule) => {
      if (selectedRulesSet.has(rule.name)) {
        rule.site_rules.forEach((siteRule) => siteRuleSets.add(siteRule));
        rule.ip_rules.forEach((ipRule) => ipRuleSets.add(ipRule));
      }
    });
    const site_rule_sets = Array.from(siteRuleSets).map((rule) => ({
      tag: rule,
      type: "remote",
      format: "binary",
      url: `${SITE_RULE_SET_BASE_URL}${SITE_RULE_SETS[rule]}`
    }));
    const ip_rule_sets = Array.from(ipRuleSets).map((rule) => ({
      tag: `${rule}-ip`,
      type: "remote",
      format: "binary",
      url: `${IP_RULE_SET_BASE_URL}${IP_RULE_SETS[rule]}`
    }));
    if (!selectedRules.includes("Non-China")) {
      site_rule_sets.push({
        tag: "geolocation-!cn",
        type: "remote",
        format: "binary",
        url: `${SITE_RULE_SET_BASE_URL}geosite-geolocation-!cn.srs`
      });
    }
    if (customRules) {
      customRules.forEach((rule) => {
        if (rule.site != "") {
          rule.site.split(",").forEach((site) => {
            site_rule_sets.push({
              tag: site.trim(),
              type: "remote",
              format: "binary",
              url: `${SITE_RULE_SET_BASE_URL}geosite-${site.trim()}.srs`
            });
          });
        }
        if (rule.ip != "") {
          rule.ip.split(",").forEach((ip) => {
            ip_rule_sets.push({
              tag: `${ip.trim()}-ip`,
              type: "remote",
              format: "binary",
              url: `${IP_RULE_SET_BASE_URL}geoip-${ip.trim()}.srs`
            });
          });
        }
      });
    }
    ruleSets.push(...site_rule_sets, ...ip_rule_sets);
    return { site_rule_sets, ip_rule_sets };
  }
  __name(generateRuleSets, "generateRuleSets");
  function generateClashRuleSets(selectedRules = [], customRules = []) {
    if (typeof selectedRules === "string" && PREDEFINED_RULE_SETS[selectedRules]) {
      selectedRules = PREDEFINED_RULE_SETS[selectedRules];
    }
    if (!selectedRules || selectedRules.length === 0) {
      selectedRules = PREDEFINED_RULE_SETS.minimal;
    }
    const selectedRulesSet = new Set(selectedRules);
    const siteRuleSets = /* @__PURE__ */ new Set();
    const ipRuleSets = /* @__PURE__ */ new Set();
    UNIFIED_RULES.forEach((rule) => {
      if (selectedRulesSet.has(rule.name)) {
        rule.site_rules.forEach((siteRule) => siteRuleSets.add(siteRule));
        rule.ip_rules.forEach((ipRule) => ipRuleSets.add(ipRule));
      }
    });
    const site_rule_providers = {};
    const ip_rule_providers = {};
    Array.from(siteRuleSets).forEach((rule) => {
      site_rule_providers[rule] = {
        type: "http",
        format: "mrs",
        behavior: "domain",
        url: `${CLASH_SITE_RULE_SET_BASE_URL}${CLASH_SITE_RULE_SETS[rule]}`,
        path: `./ruleset/${CLASH_SITE_RULE_SETS[rule]}`,
        interval: 86400
      };
    });
    Array.from(ipRuleSets).forEach((rule) => {
      ip_rule_providers[rule] = {
        type: "http",
        format: "mrs",
        behavior: "ipcidr",
        url: `${CLASH_IP_RULE_SET_BASE_URL}${CLASH_IP_RULE_SETS[rule]}`,
        path: `./ruleset/${CLASH_IP_RULE_SETS[rule]}`,
        interval: 86400
      };
    });
    if (!selectedRules.includes("Non-China")) {
      site_rule_providers["geolocation-!cn"] = {
        type: "http",
        format: "mrs",
        behavior: "domain",
        url: `${CLASH_SITE_RULE_SET_BASE_URL}geolocation-!cn.mrs`,
        path: "./ruleset/geolocation-!cn.mrs",
        interval: 86400
      };
    }
    if (customRules) {
      customRules.forEach((rule) => {
        if (rule.site != "") {
          rule.site.split(",").forEach((site) => {
            const site_trimmed = site.trim();
            site_rule_providers[site_trimmed] = {
              type: "http",
              format: "mrs",
              behavior: "domain",
              url: `${CLASH_SITE_RULE_SET_BASE_URL}${site_trimmed}.mrs`,
              path: `./ruleset/${site_trimmed}.mrs`,
              interval: 86400
            };
          });
        }
        if (rule.ip != "") {
          rule.ip.split(",").forEach((ip) => {
            const ip_trimmed = ip.trim();
            ip_rule_providers[ip_trimmed] = {
              type: "http",
              format: "mrs",
              behavior: "ipcidr",
              url: `${CLASH_IP_RULE_SET_BASE_URL}${ip_trimmed}.mrs`,
              path: `./ruleset/${ip_trimmed}.mrs`,
              interval: 86400
            };
          });
        }
      });
    }
    return { site_rule_providers, ip_rule_providers };
  }
  __name(generateClashRuleSets, "generateClashRuleSets");
  var SING_BOX_CONFIG = {
    dns: {
      servers: [
        {
          tag: "dns_proxy",
          address: "tcp://1.1.1.1",
          address_resolver: "dns_resolver",
          strategy: "ipv4_only",
          detour: "\u{1F680} \u8282\u70B9\u9009\u62E9"
        },
        {
          tag: "dns_direct",
          address: "https://dns.alidns.com/dns-query",
          address_resolver: "dns_resolver",
          strategy: "ipv4_only",
          detour: "DIRECT"
        },
        {
          tag: "dns_resolver",
          address: "223.5.5.5",
          detour: "DIRECT"
        },
        {
          tag: "dns_success",
          address: "rcode://success"
        },
        {
          tag: "dns_refused",
          address: "rcode://refused"
        },
        {
          tag: "dns_fakeip",
          address: "fakeip"
        }
      ],
      rules: [
        {
          outbound: "any",
          server: "dns_resolver"
        },
        {
          rule_set: "geolocation-!cn",
          query_type: [
            "A",
            "AAAA"
          ],
          server: "dns_fakeip"
        },
        {
          rule_set: "geolocation-!cn",
          query_type: [
            "CNAME"
          ],
          server: "dns_proxy"
        },
        {
          query_type: [
            "A",
            "AAAA",
            "CNAME"
          ],
          invert: true,
          server: "dns_refused",
          disable_cache: true
        }
      ],
      final: "dns_direct",
      independent_cache: true,
      fakeip: {
        enabled: true,
        inet4_range: "198.18.0.0/15",
        inet6_range: "fc00::/18"
      }
    },
    ntp: {
      enabled: true,
      server: "time.apple.com",
      server_port: 123,
      interval: "30m"
    },
    inbounds: [
      { type: "mixed", tag: "mixed-in", listen: "0.0.0.0", listen_port: 2080 },
      { type: "tun", tag: "tun-in", address: "172.19.0.1/30", auto_route: true, strict_route: true, stack: "mixed", sniff: true }
    ],
    outbounds: [
      { type: "block", tag: "REJECT" },
      { type: "direct", tag: "DIRECT" }
    ],
    route: {
      "rule_set": [
        {
          "tag": "geosite-geolocation-!cn",
          "type": "local",
          "format": "binary",
          "path": "geosite-geolocation-!cn.srs"
        }
      ],
      rules: []
    },
    experimental: {
      cache_file: {
        enabled: true,
        store_fakeip: true
      }
    }
  };
  var CLASH_CONFIG = {
    "port": 7890,
    "socks-port": 7891,
    "allow-lan": false,
    "mode": "rule",
    "log-level": "info",
    "geodata-mode": true,
    "geo-auto-update": true,
    "geodata-loader": "standard",
    "geo-update-interval": 24,
    "geox-url": {
      "geoip": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geoip.dat",
      "geosite": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/geosite.dat",
      "mmdb": "https://testingcf.jsdelivr.net/gh/MetaCubeX/meta-rules-dat@release/country.mmdb",
      "asn": "https://github.com/xishang0128/geoip/releases/download/latest/GeoLite2-ASN.mmdb"
    },
    "rule-providers": {
      // 将由代码自动生成
    },
    "dns": {
      "enable": true,
      "ipv6": true,
      "respect-rules": true,
      "enhanced-mode": "fake-ip",
      "nameserver": [
        "https://120.53.53.53/dns-query",
        "https://223.5.5.5/dns-query"
      ],
      "proxy-server-nameserver": [
        "https://120.53.53.53/dns-query",
        "https://223.5.5.5/dns-query"
      ],
      "nameserver-policy": {
        "geosite:cn,private": [
          "https://120.53.53.53/dns-query",
          "https://223.5.5.5/dns-query"
        ],
        "geosite:geolocation-!cn": [
          "https://dns.cloudflare.com/dns-query",
          "https://dns.google/dns-query"
        ]
      }
    },
    "proxies": [],
    "proxy-groups": []
  };
  var SURGE_CONFIG = {
    "general": {
      "allow-wifi-access": false,
      "wifi-access-http-port": 6152,
      "wifi-access-socks5-port": 6153,
      "http-listen": "127.0.0.1:6152",
      "socks5-listen": "127.0.0.1:6153",
      "allow-hotspot-access": false,
      "skip-proxy": "127.0.0.1,192.168.0.0/16,10.0.0.0/8,172.16.0.0/12,100.64.0.0/10,17.0.0.0/8,localhost,*.local,*.crashlytics.com,seed-sequoia.siri.apple.com,sequoia.apple.com",
      "test-timeout": 5,
      "proxy-test-url": "http://cp.cloudflare.com/generate_204",
      "internet-test-url": "http://www.apple.com/library/test/success.html",
      "geoip-maxmind-url": "https://raw.githubusercontent.com/Loyalsoldier/geoip/release/Country.mmdb",
      "ipv6": false,
      "show-error-page-for-reject": true,
      "dns-server": "119.29.29.29, 180.184.1.1, 223.5.5.5, system",
      "encrypted-dns-server": "https://223.5.5.5/dns-query",
      "exclude-simple-hostnames": true,
      "read-etc-hosts": true,
      "always-real-ip": "*.msftconnecttest.com, *.msftncsi.com, *.srv.nintendo.net, *.stun.playstation.net, xbox.*.microsoft.com, *.xboxlive.com, *.logon.battlenet.com.cn, *.logon.battle.net, stun.l.google.com, easy-login.10099.com.cn,*-update.xoyocdn.com, *.prod.cloud.netflix.com, appboot.netflix.com, *-appboot.netflix.com",
      "hijack-dns": "*:53",
      "udp-policy-not-supported-behaviour": "REJECT",
      "hide-vpn-icon": false
    },
    "replica": {
      "hide-apple-request": true,
      "hide-crashlytics-request": true,
      "use-keyword-filter": false,
      "hide-udp": false
    }
  };

  // src/ProxyParsers.js
  var ProxyParser = class {
    static parse(url, userAgent) {
      url = url.trim();
      const type2 = url.split("://")[0];
      switch (type2) {
        case "ss":
          return new ShadowsocksParser().parse(url);
        case "vmess":
          return new VmessParser().parse(url);
        case "vless":
          return new VlessParser().parse(url);
        case "hysteria":
        case "hysteria2":
        case "hy2":
          return new Hysteria2Parser().parse(url);
        case "http":
        case "https":
          return HttpParser.parse(url, userAgent);
        case "trojan":
          return new TrojanParser().parse(url);
        case "tuic":
          return new TuicParser().parse(url);
      }
    }
  };
  __name(ProxyParser, "ProxyParser");
  var ShadowsocksParser = class {
    parse(url) {
      let parts = url.replace("ss://", "").split("#");
      let mainPart = parts[0];
      let tag = parts[1];
      if (tag && tag.includes("%")) {
        tag = decodeURIComponent(tag);
      }
      try {
        let [base64, serverPart] = mainPart.split("@");
        if (!serverPart) {
          let decodedLegacy = base64ToBinary(mainPart);
          let [methodAndPass, serverInfo] = decodedLegacy.split("@");
          let [method2, password2] = methodAndPass.split(":");
          let [server2, server_port2] = this.parseServer(serverInfo);
          return this.createConfig(tag, server2, server_port2, method2, password2);
        }
        let decodedParts = base64ToBinary(decodeURIComponent(base64)).split(":");
        let method = decodedParts[0];
        let password = decodedParts.slice(1).join(":");
        let [server, server_port] = this.parseServer(serverPart);
        return this.createConfig(tag, server, server_port, method, password);
      } catch (e) {
        console.error("Failed to parse shadowsocks URL:", e);
        return null;
      }
    }
    // Helper method to parse server info
    parseServer(serverPart) {
      let match = serverPart.match(/\[([^\]]+)\]:(\d+)/);
      if (match) {
        return [match[1], match[2]];
      }
      return serverPart.split(":");
    }
    // Helper method to create config object
    createConfig(tag, server, server_port, method, password) {
      return {
        "tag": tag || "Shadowsocks",
        "type": "shadowsocks",
        "server": server,
        "server_port": parseInt(server_port),
        "method": method,
        "password": password,
        "network": "tcp",
        "tcp_fast_open": false
      };
    }
  };
  __name(ShadowsocksParser, "ShadowsocksParser");
  var VmessParser = class {
    parse(url) {
      let base64 = url.replace("vmess://", "");
      let vmessConfig = JSON.parse(decodeBase64(base64));
      let tls = { "enabled": false };
      let transport = {};
      if (vmessConfig.net === "ws") {
        transport = {
          "type": "ws",
          "path": vmessConfig.path,
          "headers": { "Host": vmessConfig.host ? vmessConfig.host : vmessConfig.sni }
        };
        if (vmessConfig.tls !== "") {
          tls = {
            "enabled": true,
            "server_name": vmessConfig.sni,
            "insecure": false
          };
        }
      }
      return {
        "tag": vmessConfig.ps,
        "type": "vmess",
        "server": vmessConfig.add,
        "server_port": parseInt(vmessConfig.port),
        "uuid": vmessConfig.id,
        "alter_id": parseInt(vmessConfig.aid),
        "security": vmessConfig.scy || "auto",
        "network": "tcp",
        "tcp_fast_open": false,
        "transport": transport,
        "tls": tls.enabled ? tls : void 0
      };
    }
  };
  __name(VmessParser, "VmessParser");
  var VlessParser = class {
    parse(url) {
      const { addressPart, params, name } = parseUrlParams(url);
      const [uuid, serverInfo] = addressPart.split("@");
      const { host, port } = parseServerInfo(serverInfo);
      const tls = createTlsConfig(params);
      if (tls.reality) {
        tls.utls = {
          enabled: true,
          fingerprint: "chrome"
        };
      }
      const transport = params.type !== "tcp" ? createTransportConfig(params) : void 0;
      return {
        type: "vless",
        tag: name,
        server: host,
        server_port: port,
        uuid: decodeURIComponent(uuid),
        tcp_fast_open: false,
        tls,
        transport,
        network: "tcp",
        flow: params.flow ?? void 0
      };
    }
  };
  __name(VlessParser, "VlessParser");
  var Hysteria2Parser = class {
    parse(url) {
      const { addressPart, params, name } = parseUrlParams(url);
      let host, port;
      let password = null;
      if (addressPart.includes("@")) {
        const [uuid, serverInfo] = addressPart.split("@");
        const parsed = parseServerInfo(serverInfo);
        host = parsed.host;
        port = parsed.port;
        password = decodeURIComponent(uuid);
      } else {
        const parsed = parseServerInfo(addressPart);
        host = parsed.host;
        port = parsed.port;
        password = params.auth;
      }
      const tls = createTlsConfig(params);
      const obfs = {};
      if (params["obfs-password"]) {
        obfs.type = params.obfs;
        obfs.password = params["obfs-password"];
      }
      ;
      return {
        tag: name,
        type: "hysteria2",
        server: host,
        server_port: port,
        password,
        tls,
        obfs,
        auth: params.auth,
        recv_window_conn: params.recv_window_conn,
        up_mbps: params?.upmbps ? parseInt(params.upmbps) : void 0,
        down_mbps: params?.downmbps ? parseInt(params.downmbps) : void 0
      };
    }
  };
  __name(Hysteria2Parser, "Hysteria2Parser");
  var TrojanParser = class {
    parse(url) {
      const { addressPart, params, name } = parseUrlParams(url);
      const [password, serverInfo] = addressPart.split("@");
      const { host, port } = parseServerInfo(serverInfo);
      const parsedURL = parseServerInfo(addressPart);
      const tls = createTlsConfig(params);
      const transport = params.type !== "tcp" ? createTransportConfig(params) : void 0;
      return {
        type: "trojan",
        tag: name,
        server: host,
        server_port: port,
        password: decodeURIComponent(password) || parsedURL.username,
        network: "tcp",
        tcp_fast_open: false,
        tls,
        transport,
        flow: params.flow ?? void 0
      };
    }
  };
  __name(TrojanParser, "TrojanParser");
  var TuicParser = class {
    parse(url) {
      const { addressPart, params, name } = parseUrlParams(url);
      const [userinfo, serverInfo] = addressPart.split("@");
      const { host, port } = parseServerInfo(serverInfo);
      const tls = {
        enabled: true,
        server_name: params.sni,
        alpn: [params.alpn],
        insecure: true
      };
      return {
        tag: name,
        type: "tuic",
        server: host,
        server_port: port,
        uuid: decodeURIComponent(userinfo).split(":")[0],
        password: decodeURIComponent(userinfo).split(":")[1],
        congestion_control: params.congestion_control,
        tls,
        flow: params.flow ?? void 0
      };
    }
  };
  __name(TuicParser, "TuicParser");
  var HttpParser = class {
    static async parse(url, userAgent) {
      try {
        let headers = new Headers({
          "User-Agent": userAgent
        });
        const response = await fetch(url, {
          method: "GET",
          headers
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        let decodedText;
        try {
          decodedText = decodeBase64(text.trim());
          if (decodedText.includes("%")) {
            decodedText = decodeURIComponent(decodedText);
          }
        } catch (e) {
          decodedText = text;
          if (decodedText.includes("%")) {
            try {
              decodedText = decodeURIComponent(decodedText);
            } catch (urlError) {
              console.warn("Failed to URL decode the text:", urlError);
            }
          }
        }
        return decodedText.split("\n").filter((line) => line.trim() !== "");
      } catch (error) {
        console.error("Error fetching or parsing HTTP(S) content:", error);
        return null;
      }
    }
  };
  __name(HttpParser, "HttpParser");

  // src/BaseConfigBuilder.js
  var BaseConfigBuilder = class {
    constructor(inputString, baseConfig, lang, userAgent) {
      this.inputString = inputString;
      this.config = DeepCopy(baseConfig);
      this.customRules = [];
      this.selectedRules = [];
      setLanguage(lang);
      this.userAgent = userAgent;
    }
    async build() {
      const customItems = await this.parseCustomItems();
      this.addCustomItems(customItems);
      this.addSelectors();
      return this.formatConfig();
    }
    async parseCustomItems() {
      const urls = this.inputString.split("\n").filter((url) => url.trim() !== "");
      const parsedItems = [];
      for (const url of urls) {
        let processedUrls = this.tryDecodeBase64(url);
        if (!Array.isArray(processedUrls)) {
          processedUrls = [processedUrls];
        }
        for (const processedUrl of processedUrls) {
          const result = await ProxyParser.parse(processedUrl, this.userAgent);
          if (Array.isArray(result)) {
            for (const subUrl of result) {
              const subResult = await ProxyParser.parse(subUrl, this.userAgent);
              if (subResult) {
                parsedItems.push(subResult);
              }
            }
          } else if (result) {
            parsedItems.push(result);
          }
        }
      }
      return parsedItems;
    }
    tryDecodeBase64(str2) {
      if (str2.includes("://")) {
        return str2;
      }
      try {
        const decoded = decodeBase64(str2);
        if (decoded.includes("\n")) {
          const multipleUrls = decoded.split("\n").filter((url) => url.trim() !== "");
          if (multipleUrls.some((url) => url.includes("://"))) {
            return multipleUrls;
          }
        }
        if (decoded.includes("://")) {
          return decoded;
        }
      } catch (e) {
      }
      return str2;
    }
    getOutboundsList() {
      let outbounds;
      if (typeof this.selectedRules === "string" && PREDEFINED_RULE_SETS[this.selectedRules]) {
        outbounds = getOutbounds(PREDEFINED_RULE_SETS[this.selectedRules]);
      } else if (this.selectedRules && Object.keys(this.selectedRules).length > 0) {
        outbounds = getOutbounds(this.selectedRules);
      } else {
        outbounds = getOutbounds(PREDEFINED_RULE_SETS.minimal);
      }
      return outbounds;
    }
    getProxyList() {
      return this.getProxies().map((proxy) => this.getProxyName(proxy));
    }
    getProxies() {
      throw new Error("getProxies must be implemented in child class");
    }
    getProxyName(proxy) {
      throw new Error("getProxyName must be implemented in child class");
    }
    convertProxy(proxy) {
      throw new Error("convertProxy must be implemented in child class");
    }
    addProxyToConfig(proxy) {
      throw new Error("addProxyToConfig must be implemented in child class");
    }
    addAutoSelectGroup(proxyList) {
      throw new Error("addAutoSelectGroup must be implemented in child class");
    }
    addNodeSelectGroup(proxyList) {
      throw new Error("addNodeSelectGroup must be implemented in child class");
    }
    addOutboundGroups(outbounds, proxyList) {
      throw new Error("addOutboundGroups must be implemented in child class");
    }
    addCustomRuleGroups(proxyList) {
      throw new Error("addCustomRuleGroups must be implemented in child class");
    }
    addFallBackGroup(proxyList) {
      throw new Error("addFallBackGroup must be implemented in child class");
    }
    addCustomItems(customItems) {
      const validItems = customItems.filter((item) => item != null);
      validItems.forEach((item) => {
        if (item?.tag) {
          const convertedProxy = this.convertProxy(item);
          if (convertedProxy) {
            this.addProxyToConfig(convertedProxy);
          }
        }
      });
    }
    addSelectors() {
      const outbounds = this.getOutboundsList();
      const proxyList = this.getProxyList();
      this.addAutoSelectGroup(proxyList);
      this.addNodeSelectGroup(proxyList);
      this.addOutboundGroups(outbounds, proxyList);
      this.addCustomRuleGroups(proxyList);
      this.addFallBackGroup(proxyList);
    }
    generateRules() {
      return generateRules(this.selectedRules, this.customRules);
    }
    formatConfig() {
      throw new Error("formatConfig must be implemented in child class");
    }
  };
  __name(BaseConfigBuilder, "BaseConfigBuilder");

  // src/SingboxConfigBuilder.js
  var SingboxConfigBuilder = class extends BaseConfigBuilder {
    constructor(inputString, selectedRules, customRules, baseConfig, lang, userAgent) {
      if (baseConfig === void 0) {
        baseConfig = SING_BOX_CONFIG;
        if (baseConfig.dns && baseConfig.dns.servers) {
          baseConfig.dns.servers[0].detour = t("outboundNames.Node Select");
        }
      }
      super(inputString, baseConfig, lang, userAgent);
      this.selectedRules = selectedRules;
      this.customRules = customRules;
    }
    getProxies() {
      return this.config.outbounds.filter((outbound) => outbound?.server != void 0);
    }
    getProxyName(proxy) {
      return proxy.tag;
    }
    convertProxy(proxy) {
      return proxy;
    }
    addProxyToConfig(proxy) {
      const similarProxies = this.config.outbounds.filter((p) => p.tag && p.tag.includes(proxy.tag));
      const isIdentical = similarProxies.some((p) => {
        const { tag: _, ...restOfProxy } = proxy;
        const { tag: __, ...restOfP } = p;
        return JSON.stringify(restOfProxy) === JSON.stringify(restOfP);
      });
      if (isIdentical) {
        return;
      }
      if (similarProxies.length > 0) {
        proxy.tag = `${proxy.tag} ${similarProxies.length + 1}`;
      }
      this.config.outbounds.push(proxy);
    }
    addAutoSelectGroup(proxyList) {
      this.config.outbounds.unshift({
        type: "urltest",
        tag: t("outboundNames.Auto Select"),
        outbounds: DeepCopy(proxyList)
      });
    }
    addNodeSelectGroup(proxyList) {
      proxyList.unshift("DIRECT", "REJECT", t("outboundNames.Auto Select"));
      this.config.outbounds.unshift({
        type: "selector",
        tag: t("outboundNames.Node Select"),
        outbounds: proxyList
      });
    }
    addOutboundGroups(outbounds, proxyList) {
      outbounds.forEach((outbound) => {
        if (outbound !== t("outboundNames.Node Select")) {
          this.config.outbounds.push({
            type: "selector",
            tag: t(`outboundNames.${outbound}`),
            outbounds: [t("outboundNames.Node Select"), ...proxyList]
          });
        }
      });
    }
    addCustomRuleGroups(proxyList) {
      if (Array.isArray(this.customRules)) {
        this.customRules.forEach((rule) => {
          this.config.outbounds.push({
            type: "selector",
            tag: rule.name,
            outbounds: [t("outboundNames.Node Select"), ...proxyList]
          });
        });
      }
    }
    addFallBackGroup(proxyList) {
      this.config.outbounds.push({
        type: "selector",
        tag: t("outboundNames.Fall Back"),
        outbounds: [t("outboundNames.Node Select"), ...proxyList]
      });
    }
    formatConfig() {
      const rules = generateRules(this.selectedRules, this.customRules);
      const { site_rule_sets, ip_rule_sets } = generateRuleSets(this.selectedRules, this.customRules);
      this.config.route.rule_set = [...site_rule_sets, ...ip_rule_sets];
      rules.filter((rule) => !!rule.domain_suffix || !!rule.domain_keyword).map((rule) => {
        this.config.route.rules.push({
          domain_suffix: rule.domain_suffix,
          domain_keyword: rule.domain_keyword,
          protocol: rule.protocol,
          outbound: t(`outboundNames.${rule.outbound}`)
        });
      });
      rules.filter((rule) => !!rule.site_rules[0]).map((rule) => {
        this.config.route.rules.push({
          rule_set: [
            ...rule.site_rules.length > 0 && rule.site_rules[0] !== "" ? rule.site_rules : []
          ],
          protocol: rule.protocol,
          outbound: t(`outboundNames.${rule.outbound}`)
        });
      });
      rules.filter((rule) => !!rule.ip_rules[0]).map((rule) => {
        this.config.route.rules.push({
          rule_set: [
            ...rule.ip_rules.filter((ip) => ip.trim() !== "").map((ip) => `${ip}-ip`)
          ],
          protocol: rule.protocol,
          outbound: t(`outboundNames.${rule.outbound}`)
        });
      });
      rules.filter((rule) => !!rule.ip_cidr).map((rule) => {
        this.config.route.rules.push({
          ip_cidr: rule.ip_cidr,
          protocol: rule.protocol,
          outbound: t(`outboundNames.${rule.outbound}`)
        });
      });
      this.config.route.rules.unshift(
        { clash_mode: "direct", outbound: "DIRECT" },
        { clash_mode: "global", outbound: t("outboundNames.Node Select") },
        { action: "sniff" },
        { protocol: "dns", action: "hijack-dns" }
      );
      this.config.route.auto_detect_interface = true;
      this.config.route.final = t("outboundNames.Fall Back");
      return this.config;
    }
  };
  __name(SingboxConfigBuilder, "SingboxConfigBuilder");

  // src/style.js
  var generateStyles = /* @__PURE__ */ __name(() => `
  :root {
    --bg-color: #f0f2f5;
    --text-color: #495057;
    --card-bg: #ffffff;
    --card-header-bg: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    --btn-primary-bg: linear-gradient(135deg, #6a11cb 0%, #2575fc 100%);
    --input-bg: #ffffff;
    --input-border: #ced4da;
    --input-text: #495057;
    --placeholder-color: #6c757d;
    --section-border: rgba(0, 0, 0, 0.1);
    --section-bg: rgba(0, 0, 0, 0.02);
    --select-bg: #ffffff;
    --select-text: #495057;
    --select-border: #ced4da;
    --dropdown-bg: #ffffff;
    --dropdown-text: #495057;
    --dropdown-hover-bg: #f8f9fa;
    --dropdown-hover-text: #495057;
    --switch-bg: #e9ecef;
    --switch-checked-bg: #6a11cb;
    --transition-speed: 0.3s;
    --transition-timing: cubic-bezier(0.4, 0, 0.2, 1);
  }

  [data-theme="dark"] {
    --bg-color: #1a1a1a;
    --text-color: #e0e0e0;
    --card-bg: #2c2c2c;
    --card-header-bg: linear-gradient(135deg, #4a0e8f 0%, #1a5ab8 100%);
    --btn-primary-bg: linear-gradient(135deg, #4a0e8f 0%, #1a5ab8 100%);
    --input-bg: #3c3c3c;
    --input-border: #555555;
    --input-text: #e0e0e0;
    --placeholder-color: #adb5bd;
    --section-border: rgba(255, 255, 255, 0.1);
    --section-bg: rgba(255, 255, 255, 0.02);
    --select-bg: #3c3c3c;
    --select-text: #e0e0e0;
    --select-border: #555555;
    --dropdown-bg: #2c2c2c;
    --dropdown-text: #e0e0e0;
    --dropdown-hover-bg: #3c3c3c;
    --dropdown-hover-text: #e0e0e0;
    --switch-bg: #555555;
    --switch-checked-bg: #4a0e8f;
  }

  .container { max-width: 800px; }

  body {
    background-color: var(--bg-color);
    color: var(--text-color);
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    transition: background-color 0.3s var(--transition-timing), color 0.3s var(--transition-timing);
  }

  .card {
    background-color: var(--card-bg);
    border: none;
    border-radius: 15px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    margin-bottom: 2rem;
  }

  .card-header {
    background: var(--card-header-bg);
    color: white;
    border-radius: 15px 15px 0 0;
    padding: 2.5rem 2rem;
    border-bottom: 1px solid var(--section-border);
  }

  .card-body {
    padding: 2rem;
  }

  .form-section {
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    border: 1px solid var(--section-border);
    border-radius: 10px;
    background: var(--section-bg);
  }

  /* Ensure form button containers have proper spacing */
  .card-body .d-flex {
    margin-left: 0;
    margin-right: 0;
  }

  /* Target the convert/clear button container specifically */
  /* Ensure consistent spacing with other form elements */
  .card-body > form > .d-flex.gap-2.mt-4 {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  .button-container {
    margin-left: 1.5rem !important;
    margin-right: 1.5rem !important;
    padding: 0;
    border: none;
    background: none;
  }
    
  .form-section-title {
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--text-color);
  }

  .input-group {
    margin-bottom: 1rem;
  }

  .form-control, .form-select {
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: all 0.3s ease;
  }

  .form-control:focus, .form-select:focus {
    border-color: #6a11cb;
    box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
  }

  .btn {
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.3s ease;
  }

  .btn-primary {
    background: var(--btn-primary-bg);
    border: none;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(106, 17, 203, 0.2);
  }

  .input-group-text, .form-control {
    background-color: var(--input-bg);
    border-color: var(--input-border);
    color: var(--input-text);
  }

  .form-control:focus {
    background-color: var(--input-bg);
    color: var(--input-text);
    box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
  }

  .input-group { box-shadow: 0 4px 6px rgba(0, 0, 0, 0.04); }

  h2, h4 {
    color: var(--text-color);
    font-weight: 600;
  }

  h5 {
    color: var(--text-color);
    font-weight: 500;
  }

  .form-label {
    font-weight: 500;
    color: var(--text-color);
  }

  .btn-outline-secondary {
    color: var(--text-color);
    border-color: var(--input-border);
  }

  .btn-outline-secondary:hover {
    background-color: var(--input-bg);
    color: var(--text-color);
  }

  .btn-success {
    background-color: #28a745;
    border-color: #28a745;
    color: white;
  }

  .btn-success:hover {
    background-color: #218838;
    border-color: #1e7e34;
  }

  #darkModeToggle {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
    color: var(--text-color);
    border-color: var(--input-border);
    background-color: var(--card-bg);
    transition: all 0.3s var(--transition-timing);
  }

  #darkModeToggle:hover {
    background-color: var(--dropdown-hover-bg);
    border-color: var(--text-color);
    color: var(--text-color);
  }

  .github-link {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    font-size: 2rem;
    color: var(--text-color);
    transition: color 0.3s ease;
  }

  .github-link:hover { color: #6a11cb; }
  
  .tooltip-icon {
    cursor: pointer;
    margin-left: 5px;
    color: var(--text-color);
    position: relative;
    display: inline-block;
    vertical-align: super;
    font-size: 1em;
  }

  .question-mark {
    display: inline-block;
    width: 16px;
    height: 16px;
    line-height: 16px;
    text-align: center;
    border-radius: 50%;
    background-color: var(--text-color);
    color: var(--card-bg);
  }

  .tooltip-content {
    visibility: hidden;
    opacity: 0;
    background-color: var(--card-bg);
    position: fixed;
    background-color: var(--card-bg);
    color: var(--text-color);
    border: 1px solid var(--input-border);
    border-radius: 6px;
    padding: 10px;
    z-index: 1000;
    width: 180px;
    max-width: 90vw;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    transition: opacity 0.3s, visibility 0.3s;
  }

  .tooltip-icon:hover .tooltip-content {
    visibility: visible;
    opacity: 1;
  }

  @media (max-width: 768px) {
    .tooltip-content {
      width: 250px;
      left: auto;
      right: 0;
      transform: none;
    }
  }

  .form-check-input {
    background-color: var(--checkbox-bg);
    border-color: var(--checkbox-border);
  }

  .form-check-input:checked {
    background-color: var(--checkbox-checked-bg);
    border-color: var(--checkbox-checked-border);
  }

  .form-check-label {
    color: var(--text-color);
  }
  .explanation-text {
    background-color: var(--explanation-bg);
    color: var(--explanation-text);
    padding: 10px;
    border-radius: 5px;
    margin-bottom: 15px;
    transition: background-color 0.3s ease, color 0.3s ease;
  }

  .form-select {
    background-color: var(--select-bg);
    color: var(--select-text);
    border-color: var(--select-border);
    transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
    
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;

    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23495057' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1em;
    padding-right: 2.5em;
  }

  [data-theme="dark"] .form-select {
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23e0e0e0' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  }

  .form-select:focus {
    background-color: var(--select-bg);
    color: var(--select-text);
    border-color: var(--checkbox-checked-border);
    box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
  }

  .form-control::placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  .form-control::-webkit-input-placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  .form-control::-moz-placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  .form-control:-ms-input-placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  .form-control::-ms-input-placeholder {
    color: var(--placeholder-color);
    opacity: 1;
  }

  #advancedOptions {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transform: translateY(-20px);
    transition: max-height 0.5s var(--transition-timing),
                opacity 0.3s var(--transition-timing),
                transform 0.3s var(--transition-timing);
  }

  #advancedOptions.show {
    max-height: none;
    opacity: 1;
    transform: translateY(0);
    overflow: visible;
  }

  /* Custom Rules Section */
  .custom-rules-section {
    margin-bottom: 1.5rem;
  }

  .custom-rules-header {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--section-border);
  }

  .custom-rules-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
    margin-right: 0.5rem;
  }

  /* Custom Rules Container Styling */
  .custom-rules-container {
    border: 1px solid var(--input-border);
    border-radius: 10px;
    background-color: var(--card-bg);
    overflow: hidden;
  }

  #customRules, #customRulesJSON {
    max-height: 600px;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 1rem;
    background-color: var(--input-bg);
  }

  #customRules:empty, #customRulesJSON:empty {
    padding: 0;
  }

  /* Custom Rules Section Header */
  .custom-rules-section-header {
    display: flex;
    align-items: center;
    margin-bottom: 1.5rem;
    padding-bottom: 0.75rem;
    border-bottom: 2px solid var(--section-border);
  }

  .custom-rules-section-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-color);
    margin: 0;
    margin-right: 0.75rem;
  }

  /* Custom Rules Tabs */
  .custom-rules-tabs {
    display: flex;
    border-bottom: 2px solid var(--input-border);
    background-color: var(--card-bg);
  }

  .custom-rules-tab {
    flex: 1;
    padding: 0.875rem 1rem;
    background: none;
    border: none;
    cursor: pointer;
    font-weight: 500;
    color: var(--text-color);
    transition: all 0.3s var(--transition-timing);
    border-bottom: 3px solid transparent;
    font-size: 0.95rem;
  }

  .custom-rules-tab:hover {
    background-color: var(--dropdown-hover-bg);
    color: var(--dropdown-hover-text);
  }

  .custom-rules-tab.active {
    color: #6a11cb;
    border-bottom-color: #6a11cb;
    background-color: var(--dropdown-hover-bg);
    font-weight: 600;
  }

  /* Dark mode specific adjustments for custom rules tabs */
  [data-theme="dark"] .custom-rules-tab {
    color: var(--text-color);
  }

  [data-theme="dark"] .custom-rules-tab:hover {
    background-color: var(--dropdown-hover-bg);
    color: var(--dropdown-hover-text);
  }

  [data-theme="dark"] .custom-rules-tab.active {
    color: #8a4fff;
    border-bottom-color: #8a4fff;
    background-color: var(--dropdown-hover-bg);
  }

  .custom-rules-content {
    min-height: 200px;
  }

  .custom-rules-view {
    display: none;
  }

  .custom-rules-view.active {
    display: block;
  }

  /* Conversion Controls */
  .conversion-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 1rem;
    padding: 0.875rem;
    background-color: var(--section-bg);
    border-radius: 8px;
    border: 1px solid var(--section-border);
  }

  .conversion-controls .btn {
    font-size: 0.875rem;
    padding: 0.5rem 0.875rem;
    margin-bottom: 0.25rem;
    white-space: nowrap;
    transition: all 0.3s var(--transition-timing);
  }

  .conversion-controls .btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .conversion-controls .btn-outline-primary {
    border-color: #6a11cb;
    color: #6a11cb;
    background-color: transparent;
  }

  .conversion-controls .btn-outline-primary:hover {
    background-color: #6a11cb;
    border-color: #6a11cb;
    color: white;
  }

  .conversion-controls .btn-outline-secondary {
    border-color: var(--input-border);
    color: var(--text-color);
    background-color: transparent;
  }

  .conversion-controls .btn-outline-secondary:hover {
    background-color: var(--dropdown-hover-bg);
    border-color: var(--text-color);
    color: var(--text-color);
  }

  .conversion-controls .btn-outline-info {
    border-color: #17a2b8;
    color: #17a2b8;
    background-color: transparent;
  }

  .conversion-controls .btn-outline-info:hover {
    background-color: #17a2b8;
    border-color: #17a2b8;
    color: white;
  }

  .conversion-controls .btn-outline-danger {
    border-color: #dc3545;
    color: #dc3545;
    background-color: transparent;
  }

  .conversion-controls .btn-outline-danger:hover {
    background-color: #dc3545;
    border-color: #dc3545;
    color: white;
  }

  /* Dark mode specific button adjustments */
  [data-theme="dark"] .conversion-controls .btn-outline-primary {
    border-color: #8a4fff;
    color: #8a4fff;
  }

  [data-theme="dark"] .conversion-controls .btn-outline-primary:hover {
    background-color: #8a4fff;
    border-color: #8a4fff;
    color: white;
  }

  [data-theme="dark"] .conversion-controls .btn-outline-secondary {
    border-color: var(--input-border);
    color: var(--text-color);
  }

  [data-theme="dark"] .conversion-controls .btn-outline-secondary:hover {
    background-color: var(--dropdown-hover-bg);
    border-color: var(--text-color);
    color: var(--text-color);
  }

  [data-theme="dark"] .conversion-controls .btn-outline-info {
    border-color: #20c997;
    color: #20c997;
  }

  [data-theme="dark"] .conversion-controls .btn-outline-info:hover {
    background-color: #20c997;
    border-color: #20c997;
    color: white;
  }

  [data-theme="dark"] .conversion-controls .btn-outline-danger {
    border-color: #ff6b6b;
    color: #ff6b6b;
  }

  [data-theme="dark"] .conversion-controls .btn-outline-danger:hover {
    background-color: #ff6b6b;
    border-color: #ff6b6b;
    color: white;
  }

  /* Empty State Messages */
  .empty-state {
    text-align: center;
    padding: 2rem 1rem;
    color: var(--placeholder-color);
    background-color: var(--section-bg);
    border-radius: 8px;
    margin: 1rem;
  }

  .empty-state i {
    color: var(--placeholder-color);
    margin-bottom: 0.75rem;
  }

  .empty-state p {
    margin: 0;
    font-size: 0.95rem;
  }

  /* JSON Validation States */
  .json-valid {
    border-color: #28a745 !important;
    box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25) !important;
  }

  .json-invalid {
    border-color: #dc3545 !important;
    box-shadow: 0 0 0 0.2rem rgba(220, 53, 69, 0.25) !important;
  }

  .json-validation-message {
    font-size: 0.875rem;
    margin-top: 0.5rem;
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.3s var(--transition-timing);
  }

  .json-validation-message.valid {
    color: #155724;
    background-color: #d4edda;
    border: 1px solid #c3e6cb;
  }

  .json-validation-message.invalid {
    color: #721c24;
    background-color: #f8d7da;
    border: 1px solid #f5c6cb;
  }

  /* Dark mode support for validation messages */
  [data-theme="dark"] .json-validation-message.valid {
    color: #75b798;
    background-color: rgba(40, 167, 69, 0.2);
    border: 1px solid rgba(40, 167, 69, 0.3);
  }

  [data-theme="dark"] .json-validation-message.invalid {
    color: #f1aeb5;
    background-color: rgba(220, 53, 69, 0.2);
    border: 1px solid rgba(220, 53, 69, 0.3);
  }

  .json-textarea-container {
    position: relative;
  }

  /* Custom Rule Cards */
  .custom-rule, .custom-rule-json {
    margin-bottom: 1rem;
    border: 1px solid var(--input-border);
    border-radius: 8px;
    background-color: var(--card-bg);
    transition: all 0.3s var(--transition-timing);
    padding: 1rem;
  }

  .custom-rule:hover, .custom-rule-json:hover {
    border-color: #6a11cb;
    box-shadow: 0 2px 8px rgba(106, 17, 203, 0.1);
  }

  .custom-rule h6, .custom-rule-json h6 {
    color: var(--text-color);
    font-weight: 600;
    margin: 0;
  }

  .custom-rule .form-label, .custom-rule-json .form-label {
    color: var(--text-color);
    font-weight: 500;
    margin-bottom: 0.5rem;
  }

  .custom-rule .form-control, .custom-rule-json .form-control {
    background-color: var(--input-bg);
    border-color: var(--input-border);
    color: var(--text-color);
  }

  .custom-rule .form-control:focus, .custom-rule-json .form-control:focus {
    background-color: var(--input-bg);
    border-color: #6a11cb;
    color: var(--text-color);
    box-shadow: 0 0 0 0.2rem rgba(106, 17, 203, 0.25);
  }

  .custom-rule .form-control::placeholder, .custom-rule-json .form-control::placeholder {
    color: var(--placeholder-color);
  }

  /* Dark mode specific adjustments for custom rule cards */
  [data-theme="dark"] .custom-rule:hover,
  [data-theme="dark"] .custom-rule-json:hover {
    border-color: #8a4fff;
    box-shadow: 0 2px 8px rgba(138, 79, 255, 0.2);
  }

  [data-theme="dark"] .custom-rule .form-control:focus,
  [data-theme="dark"] .custom-rule-json .form-control:focus {
    border-color: #8a4fff;
    box-shadow: 0 0 0 0.2rem rgba(138, 79, 255, 0.25);
  }

  .header-container {
      display: flex;
      align-items: center;
      margin-bottom: 10px;
  }
  .header-title {
      margin: 0;
      margin-right: 10px;
  }

  .qr-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s var(--transition-timing),
                visibility 0.3s var(--transition-timing);
    z-index: 1000;
  }

  .qr-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .qr-card {
    background-color: white;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    transform: scale(0.9) translateY(20px);
    transition: transform 0.3s var(--transition-timing);
  }

  .qr-modal.show .qr-card {
    transform: scale(1) translateY(0);
  }

  .qr-card img {
    max-width: 100%;
    height: auto;
  }

  .qr-card p {
    margin-top: 10px;
    color: #333;
    font-size: 16px;
  }

  .base-url-label {
    background-color: var(--input-bg);
    color: var(--input-text);
    border: 1px solid var(--input-border);
    border-radius: 0.25rem;
    padding: 0.375rem 0.75rem;
    font-size: 1rem;
    line-height: 1.5;
  }

  #subscribeLinksContainer {
    max-height: 0;
    opacity: 0;
    transform: translateY(20px);
    transition: max-height 0.5s var(--transition-timing),
                opacity 0.3s var(--transition-timing),
                transform 0.3s var(--transition-timing);
    padding: 1.5rem 1.5rem;
  }

  #subscribeLinksContainer.show {
    max-height: 1000px;
    opacity: 1;
    transform: translateY(0);
  }

  #subscribeLinksContainer.hide {
    max-height: 0;
    opacity: 0;
  }

  #subscribeLinksContainer .mb-4 {
    margin-bottom: 1.5rem !important;
  }

  #subscribeLinksContainer .mt-4 {
    margin-top: 1.5rem !important;
  }

  #subscribeLinksContainer .mt-3 {
    margin-top: 1.25rem !important;
  }

  #subscribeLinksContainer .mb-5 {
    margin-bottom: 1.5rem !important;
  }

  #subscribeLinksContainer .mt-5 {
    margin-top: 1.5rem !important;
  }

  /* Add consistent spacing between link sections */
  #subscribeLinksContainer .input-group {
    margin-bottom: 0.5rem;
    margin-left: 0;
    margin-right: 0;
  }

  #subscribeLinksContainer .form-label {
    margin-bottom: 0.75rem;
    font-weight: 500;
    color: var(--text-color);
  }

  /* Ensure proper spacing for all form elements within the container */
  #subscribeLinksContainer .mb-4 {
    padding-left: 0;
    padding-right: 0;
  }

  /* Ensure all button containers within cards have proper spacing */
  /* Fix button container spacing without interfering with gap-2 */
  .card-body .d-grid {
    margin-left: 1.5rem !important;
    margin-right: 1.5rem !important;
  }

  /* Form sections should not add extra padding to button containers */
  .form-section .d-flex.gap-2 {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* Add subtle visual separation between sections */
  #subscribeLinksContainer > div:not(:last-child) {
    border-bottom: 1px solid var(--input-border);
    padding-bottom: 1rem;
    margin-bottom: 1.5rem;
  }

  /* Remove border from the button container and ensure proper spacing */
  #subscribeLinksContainer .d-grid {
    border-bottom: none !important;
    padding-bottom: 0 !important;
    margin-bottom: 0 !important;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  /* Responsive spacing adjustments */
  @media (max-width: 768px) {
    #subscribeLinksContainer {
      padding: 1rem 1rem !important;
    }

    #subscribeLinksContainer .mb-4 {
      margin-bottom: 1rem !important;
    }

    #subscribeLinksContainer .mt-4 {
      margin-top: 1rem !important;
    }

    #subscribeLinksContainer .mt-3 {
      margin-top: 0.75rem !important;
    }

    #subscribeLinksContainer .mb-5 {
      margin-bottom: 1rem !important;
    }

    #subscribeLinksContainer .mt-5 {
      margin-top: 1rem !important;
    }

    /* Adjust button container spacing for mobile */
    .card-body .d-grid {
      margin-left: 1rem !important;
      margin-right: 1rem !important;
    }

    /* Form sections should not add extra spacing on mobile */
    .form-section .d-flex.gap-2 {
      margin-left: 0 !important;
      margin-right: 0 !important;
    }

    /* Add horizontal margin to main form button containers on mobile */
    .card-body > form > .d-flex.gap-2.mt-4,
    .card-body .d-flex.gap-2.mt-4 {
      margin-left: 1rem !important;
      margin-right: 1rem !important;
    }
  }

  .form-select option {
    background-color: var(--dropdown-bg);
    color: var(--dropdown-text);
  }

  .form-select option:hover {
    background-color: var(--dropdown-hover-bg);
    color: var(--dropdown-hover-text);
  }

  .form-check-input {
    background-color: var(--switch-bg);
    border-color: var(--switch-border);
  }

  .form-check-input:checked {
    background-color: var(--switch-checked-bg);
    border-color: var(--switch-checked-bg);
  }

  .dropdown-menu {
    background-color: var(--dropdown-bg);
    border-color: var(--select-border);
  }

  .dropdown-item {
    color: var(--dropdown-text);
  }

  .dropdown-item:hover,
  .dropdown-item:focus {
    background-color: var(--dropdown-hover-bg);
    color: var(--dropdown-hover-text);
  }

  /* \u901A\u7528\u8FC7\u6E21\u6548\u679C */
  .card,
  .btn,
  .form-control,
  .form-select,
  .input-group,
  .tooltip-content,
  .github-link,
  .qr-modal,
  .qr-card {
    transition: all var(--transition-speed) var(--transition-timing);
  }

  /* \u9AD8\u7EA7\u9009\u9879\u5C55\u5F00/\u6536\u8D77\u52A8\u753B - Updated to remove height constraints */
  #advancedOptions {
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transform: translateY(-20px);
    transition: max-height 0.5s var(--transition-timing),
                opacity 0.3s var(--transition-timing),
                transform 0.3s var(--transition-timing);
  }

  #advancedOptions.show {
    max-height: none;
    opacity: 1;
    transform: translateY(0);
    overflow: visible;
  }



  /* \u6309\u94AE\u60AC\u505C\u52A8\u753B */
  .btn {
    transform: translateY(0);
  }

  .btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  /* \u590D\u5236\u6309\u94AE\u6210\u529F\u52A8\u753B */
  @keyframes successPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .btn-success {
    animation: successPulse 0.3s var(--transition-timing);
  }

  /* QR\u7801\u6A21\u6001\u6846\u52A8\u753B */
  .qr-modal {
    opacity: 0;
    visibility: hidden;
    backdrop-filter: blur(5px);
    transition: opacity 0.3s var(--transition-timing),
                visibility 0.3s var(--transition-timing);
  }

  .qr-modal.show {
    opacity: 1;
    visibility: visible;
  }

  .qr-card {
    transform: scale(0.9) translateY(20px);
    transition: transform 0.3s var(--transition-timing);
  }

  .qr-modal.show .qr-card {
    transform: scale(1) translateY(0);
  }

  /* \u81EA\u5B9A\u4E49\u89C4\u5219\u6DFB\u52A0/\u5220\u9664\u52A8\u753B */
  .custom-rule {
    opacity: 0;
    transform: translateY(20px);
    animation: slideIn 0.3s var(--transition-timing) forwards;
  }

  .custom-rule.removing {
    animation: slideOut 0.3s var(--transition-timing) forwards;
  }

  @keyframes slideIn {
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes slideOut {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  /* \u6697\u8272\u6A21\u5F0F\u5207\u6362\u52A8\u753B */
  body {
    transition: background-color 0.3s var(--transition-timing),
                color 0.3s var(--transition-timing);
  }

  /* \u5DE5\u5177\u63D0\u793A\u52A8\u753B */
  .tooltip-content {
    opacity: 0;
    visibility: hidden;
    transform: translateY(10px);
    transition: opacity 0.3s var(--transition-timing),
                visibility 0.3s var(--transition-timing),
                transform 0.3s var(--transition-timing);
  }

  .tooltip-icon:hover .tooltip-content {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`, "generateStyles");

  // src/htmlBuilder.js
  function generateHtml(xrayUrl, singboxUrl, clashUrl, surgeUrl, baseUrl) {
    return `
    <!DOCTYPE html>
    <html lang="en">
      ${generateHead()}
      ${generateBody(xrayUrl, singboxUrl, clashUrl, surgeUrl, baseUrl)}
    </html>
  `;
  }
  __name(generateHtml, "generateHtml");
  var generateHead = /* @__PURE__ */ __name(() => `
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="${t("pageDescription")}">
    <meta name="keywords" content="${t("pageKeywords")}">
    <title>${t("pageTitle")}</title>
    <meta property="og:title" content="${t("ogTitle")}">
    <meta property="og:description" content="${t("ogDescription")}">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://sublink-worker.sageer.me/">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/qrcode-generator@1.4.4/qrcode.min.js"><\/script>
    <style>
      ${generateStyles()}
    </style>
  </head>
`, "generateHead");
  var generateBody = /* @__PURE__ */ __name((xrayUrl, singboxUrl, clashUrl, surgeUrl, baseUrl) => `
  <body>
    ${generateDarkModeToggle()}
    ${generateGithubLink()}
    <div class="container mt-5">
      <div class="card mb-5">
        ${generateCardHeader()}
        <div class="card-body">
          ${generateForm()}
          <div id="subscribeLinksContainer">
            ${generateSubscribeLinks(xrayUrl, singboxUrl, clashUrl, surgeUrl, baseUrl)}
          </div>
        </div>
      </div>
    </div>
    ${generateScripts()}
  </body>
`, "generateBody");
  var generateDarkModeToggle = /* @__PURE__ */ __name(() => `
  <button id="darkModeToggle" class="btn btn-outline-secondary">
    <i class="fas fa-moon"></i>
  </button>
`, "generateDarkModeToggle");
  var generateGithubLink = /* @__PURE__ */ __name(() => `
  <a href="https://github.com" target="_blank" rel="noopener noreferrer" class="github-link">
    <i class="fab fa-github"></i>
  </a>
`, "generateGithubLink");
  var generateCardHeader = /* @__PURE__ */ __name(() => `
  <div class="card-header text-center">
    <h1 class="mb-1 text-white" style="font-size: 2.8rem; line-height: 1.1;">
      \u8BA2\u9605\u94FE\u63A5\u8F6C\u6362
    </h1>
    <a href="" target="_blank" style="color: #ffe600; font-weight: bold; font-size: 1.5rem; text-decoration: none;">
      
    </a>
  </div>
`, "generateCardHeader");
  var generateForm = /* @__PURE__ */ __name(() => `
  <form method="POST" id="encodeForm">
    ${generateShareUrlsSection()}
    ${generateAdvancedOptionsToggle()}
    ${generateAdvancedOptions()}
    ${generateButtonContainer()}
  </form>
`, "generateForm");
  var generateShareUrlsSection = /* @__PURE__ */ __name(() => `
  <div class="form-section">
    <div class="form-section-title">${t("shareUrls")}</div>
    <textarea class="form-control" id="inputTextarea" name="input" required placeholder="${t("urlPlaceholder")}" rows="3"></textarea>
  </div>
`, "generateShareUrlsSection");
  var generateAdvancedOptionsToggle = /* @__PURE__ */ __name(() => `
  <div class="form-check form-switch mb-3">
    <input class="form-check-input" type="checkbox" id="advancedToggle">
    <label class="form-check-label" for="advancedToggle">${t("advancedOptions")}</label>
  </div>
`, "generateAdvancedOptionsToggle");
  var generateAdvancedOptions = /* @__PURE__ */ __name(() => `
  <div id="advancedOptions">
    ${generateRuleSetSelection()}
    ${generateBaseConfigSection()}
    ${generateUASection()}
  </div>
`, "generateAdvancedOptions");
  var generateButtonContainer = /* @__PURE__ */ __name(() => `
  <div class="button-container d-flex gap-2 mt-4">
    <button type="submit" class="btn btn-primary flex-grow-1">
      <i class="fas fa-sync-alt me-2"></i>${t("convert")}
    </button>
    <button type="button" class="btn btn-outline-secondary" id="clearFormBtn">
      <i class="fas fa-trash-alt me-2"></i>${t("clear")}
    </button>
  </div>
`, "generateButtonContainer");
  var generateSubscribeLinks = /* @__PURE__ */ __name((xrayUrl, singboxUrl, clashUrl, surgeUrl, baseUrl) => `
  <div class="mt-4">
    ${generateLinkInput("Xray Link (Base64):", "xrayLink", xrayUrl)}
    ${generateLinkInput("SingBox Link:", "singboxLink", singboxUrl)}
    ${generateLinkInput("Clash Link:", "clashLink", clashUrl)}
    ${generateLinkInput("Surge Link:", "surgeLink", surgeUrl)}
    ${generateCustomPathSection(baseUrl)}
    ${generateShortenButton()}
  </div>
`, "generateSubscribeLinks");
  var generateLinkInput = /* @__PURE__ */ __name((label, id, value) => `
  <div class="mb-4">
    <label for="${id}" class="form-label">${label}</label>
    <div class="input-group">
      <span class="input-group-text"><i class="fas fa-link"></i></span>
      <input type="text" class="form-control" id="${id}" value="${value}" readonly>
      <button class="btn btn-outline-secondary" type="button" onclick="copyToClipboard('${id}')">
        <i class="fas fa-copy"></i>
      </button>
      <button class="btn btn-outline-secondary" type="button" onclick="generateQRCode('${id}')">
        <i class="fas fa-qrcode"></i>
      </button>
    </div>
  </div>
`, "generateLinkInput");
  var generateCustomPathSection = /* @__PURE__ */ __name((baseUrl) => `
  <div class="mb-4 mt-3">
    <label for="customShortCode" class="form-label">${t("customPath")}</label>
    <div class="input-group flex-nowrap">
      <span class="input-group-text text-truncate" style="max-width: 400px;" title="${baseUrl}/s/">
        ${baseUrl}/s/
      </span>
      <input type="text" class="form-control" id="customShortCode" placeholder="e.g. my-custom-link">
      <select id="savedCustomPaths" class="form-select" style="max-width: 200px;">
        <option value="">${t("savedPaths")}</option>
      </select>
      <button class="btn btn-outline-danger" type="button" onclick="deleteSelectedPath()">
        <i class="fas fa-trash-alt"></i>
      </button>
    </div>
  </div>
`, "generateCustomPathSection");
  var generateShortenButton = /* @__PURE__ */ __name(() => `
  <div class="d-grid mt-3">
    <button class="btn btn-primary btn-lg" type="button" onclick="shortenAllUrls()">
      <i class="fas fa-compress-alt me-2"></i>${t("shortenLinks")}
    </button>
  </div>
`, "generateShortenButton");
  var generateScripts = /* @__PURE__ */ __name(() => `
  <script>
    ${copyToClipboardFunction()}
    ${shortenAllUrlsFunction()}
    ${darkModeToggleFunction()}
    ${advancedOptionsToggleFunction()}
    ${applyPredefinedRulesFunction()}
    ${tooltipFunction()}
    ${submitFormFunction()}
    ${customRuleFunctions()}
    ${generateQRCodeFunction()}
    ${customPathFunctions()}
    ${saveConfig()}
    ${clearConfig()}
  <\/script>
`, "generateScripts");
  var customPathFunctions = /* @__PURE__ */ __name(() => `
  function saveCustomPath() {
    const customPath = document.getElementById('customShortCode').value;
    if (customPath) {
      let savedPaths = JSON.parse(localStorage.getItem('savedCustomPaths') || '[]');
      if (!savedPaths.includes(customPath)) {
        savedPaths.push(customPath);
        localStorage.setItem('savedCustomPaths', JSON.stringify(savedPaths));
        updateSavedPathsDropdown();
      }
    }
  }

  function updateSavedPathsDropdown() {
    const savedPaths = JSON.parse(localStorage.getItem('savedCustomPaths') || '[]');
    const dropdown = document.getElementById('savedCustomPaths');
    dropdown.innerHTML = '<option value="">Saved paths</option>';
    savedPaths.forEach(path => {
      const option = document.createElement('option');
      option.value = path;
      option.textContent = path;
      dropdown.appendChild(option);
    });
  }

  function loadSavedCustomPath() {
    const dropdown = document.getElementById('savedCustomPaths');
    const customShortCode = document.getElementById('customShortCode');
    if (dropdown.value) {
      customShortCode.value = dropdown.value;
    }
  }

  function deleteSelectedPath() {
    const dropdown = document.getElementById('savedCustomPaths');
    const selectedPath = dropdown.value;
    if (selectedPath) {
      let savedPaths = JSON.parse(localStorage.getItem('savedCustomPaths') || '[]');
      savedPaths = savedPaths.filter(path => path !== selectedPath);
      localStorage.setItem('savedCustomPaths', JSON.stringify(savedPaths));
      updateSavedPathsDropdown();
      document.getElementById('customShortCode').value = '';
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    updateSavedPathsDropdown();
    document.getElementById('savedCustomPaths').addEventListener('change', loadSavedCustomPath);
  });
`, "customPathFunctions");
  var advancedOptionsToggleFunction = /* @__PURE__ */ __name(() => `
  document.getElementById('advancedToggle').addEventListener('change', function() {
    const advancedOptions = document.getElementById('advancedOptions');
    if (this.checked) {
      advancedOptions.classList.add('show');
    } else {
      advancedOptions.classList.remove('show');
    }
  });
`, "advancedOptionsToggleFunction");
  var copyToClipboardFunction = /* @__PURE__ */ __name(() => `
  function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    element.select();
    document.execCommand('copy');
    
    const button = element.nextElementSibling;
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Copied!';
    button.classList.remove('btn-outline-secondary');
    button.classList.add('btn-success');
    setTimeout(() => {
      button.innerHTML = originalText;
      button.classList.remove('btn-success');
      button.classList.add('btn-outline-secondary');
    }, 2000);
  }
`, "copyToClipboardFunction");
  var shortenAllUrlsFunction = /* @__PURE__ */ __name(() => `
  let isShortening = false;

  async function shortenUrl(url, customShortCode) {
    saveCustomPath();
    const response = await fetch(\`/shorten-v2?url=\${encodeURIComponent(url)}&shortCode=\${encodeURIComponent(customShortCode || '')}\`);
    if (response.ok) {
      const data = await response.text();
      return data;
    }
    throw new Error('Failed to shorten URL');
  }

  async function shortenAllUrls() {
    if (isShortening) {
      return;
    }

    const shortenButton = document.querySelector('button[onclick="shortenAllUrls()"]');
    
    try {
      isShortening = true;
      shortenButton.disabled = true;
      shortenButton.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Shortening...';

      const singboxLink = document.getElementById('singboxLink');
      const customShortCode = document.getElementById('customShortCode').value;

      if (singboxLink.value.includes('/b/')) {
        alert('Links are already shortened!');
        return;
      }

      const shortCode = await shortenUrl(singboxLink.value, customShortCode);

      const xrayLink = document.getElementById('xrayLink');
      const clashLink = document.getElementById('clashLink');
      const surgeLink = document.getElementById('surgeLink');

      xrayLink.value = window.location.origin + '/x/' + shortCode;
      singboxLink.value = window.location.origin + '/b/' + shortCode;
      clashLink.value = window.location.origin + '/c/' + shortCode;
      surgeLink.value = window.location.origin + '/s/' + shortCode;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to shorten URLs. Please try again.');
    } finally {
      isShortening = false;
      shortenButton.disabled = false;
      shortenButton.innerHTML = '<i class="fas fa-compress-alt me-2"></i>Shorten Links';
    }
  }
`, "shortenAllUrlsFunction");
  var darkModeToggleFunction = /* @__PURE__ */ __name(() => `
  const darkModeToggle = document.getElementById('darkModeToggle');
  const body = document.body;

  darkModeToggle.addEventListener('click', () => {
    body.setAttribute('data-theme', body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    darkModeToggle.innerHTML = body.getAttribute('data-theme') === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });

  // Check for saved theme preference or use system preference
  const savedTheme = localStorage.getItem('theme');
  const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    darkModeToggle.innerHTML = savedTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  } else if (systemDarkMode) {
    body.setAttribute('data-theme', 'dark');
    darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
  }

  // Save theme preference when changed
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
        localStorage.setItem('theme', body.getAttribute('data-theme'));
      }
    });
  });

  observer.observe(body, { attributes: true });
`, "darkModeToggleFunction");
  var generateRuleSetSelection = /* @__PURE__ */ __name(() => `
  <div class="form-section">
    <div class="form-section-title d-flex align-items-center">
      ${t("ruleSelection")}
      <span class="tooltip-icon ms-2">
        <i class="fas fa-question-circle"></i>
        <span class="tooltip-content">
          ${t("ruleSelectionTooltip")}
        </span>
      </span>
    </div>
    <div class="content-container mb-3">
      <select class="form-select" id="predefinedRules" onchange="applyPredefinedRules()">
        <option value="custom">${t("custom")}</option>
        <option value="minimal">${t("minimal")}</option>
        <option value="balanced">${t("balanced")}</option>
        <option value="comprehensive">${t("comprehensive")}</option>
      </select>
    </div>
    <div class="row" id="ruleCheckboxes">
      ${UNIFIED_RULES.map((rule) => generateRuleCheckbox(rule)).join("")}
    </div>
    ${generateCustomRulesSection()}
  </div>
`, "generateRuleSetSelection");
  var generateRuleCheckbox = /* @__PURE__ */ __name((rule) => `
  <div class="col-md-4 mb-2">
    <div class="form-check">
      <input class="form-check-input rule-checkbox" type="checkbox" value="${rule.name}" id="${rule.name}" name="selectedRules">
      <label class="form-check-label" for="${rule.name}">${t("outboundNames." + rule.name)}</label>
    </div>
  </div>
`, "generateRuleCheckbox");
  var generateCustomRulesSection = /* @__PURE__ */ __name(() => `
  <div class="mt-2">
    <div class="custom-rules-section-header">
      <h5 class="custom-rules-section-title">${t("customRulesSection")}</h5>
      <span class="tooltip-icon">
        <i class="fas fa-question-circle"></i>
        <span class="tooltip-content">
          ${t("customRulesSectionTooltip")}
        </span>
      </span>
    </div>
    <div class="custom-rules-container">
      ${generateCustomRulesTabs()}
      ${generateCustomRulesContent()}
    </div>
  </div>
`, "generateCustomRulesSection");
  var generateCustomRulesTabs = /* @__PURE__ */ __name(() => `
  <div class="custom-rules-tabs">
    <button type="button" class="custom-rules-tab active" onclick="switchCustomRulesTab('form')" id="formTab">
      <i class="fas fa-edit me-2"></i>${t("customRulesForm")}
    </button>
    <button type="button" class="custom-rules-tab" onclick="switchCustomRulesTab('json')" id="jsonTab">
      <i class="fas fa-code me-2"></i>${t("customRulesJSON")}
    </button>
  </div>
`, "generateCustomRulesTabs");
  var generateCustomRulesContent = /* @__PURE__ */ __name(() => `
  <div class="custom-rules-content">
    ${generateFormView()}
    ${generateJSONView()}
  </div>
`, "generateCustomRulesContent");
  var generateFormView = /* @__PURE__ */ __name(() => `
  <div id="formView" class="custom-rules-view active">
    <div class="conversion-controls">
      <button type="button" class="btn btn-outline-primary btn-sm" onclick="addCustomRule()">
        <i class="fas fa-plus me-1"></i>${t("addCustomRule")}
      </button>
      <button type="button" class="btn btn-outline-danger btn-sm" onclick="clearAllCustomRules()">
        <i class="fas fa-trash me-1"></i>${t("clearAll")}
      </button>
    </div>
    <div id="customRules">
      <!-- Custom rules will be dynamically added here -->
    </div>
    <div id="emptyFormMessage" class="empty-state" style="display: none;">
      <i class="fas fa-plus-circle fa-2x mb-2"></i>
      <p>${t("noCustomRulesForm")}</p>
    </div>
  </div>
`, "generateFormView");
  var generateJSONView = /* @__PURE__ */ __name(() => `
  <div id="jsonView" class="custom-rules-view">
    <div class="conversion-controls">
      <button type="button" class="btn btn-outline-danger btn-sm" onclick="clearAllCustomRules()">
        <i class="fas fa-trash me-1"></i>${t("clearAll")}
      </button>
    </div>
    <div id="customRulesJSON">
      <div class="mb-2">
        <label class="form-label">${t("customRuleJSON")}</label>
        <div class="json-textarea-container">
          <textarea class="form-control json-textarea" name="customRuleJSON[]" rows="15"
                    oninput="validateJSONRealtime(this)"></textarea>
          <div class="json-validation-message" style="display: none;"></div>
        </div>
      </div>
    </div>
  </div>
`, "generateJSONView");
  var generateBaseConfigSection = /* @__PURE__ */ __name(() => `
  <div class="form-section">
    <div class="form-section-title d-flex align-items-center">
      ${t("baseConfigSettings")}
      <span class="tooltip-icon ms-2">
        <i class="fas fa-question-circle"></i>
        <span class="tooltip-content">
          ${t("baseConfigTooltip")}
        </span>
      </span>
    </div>
    <div class="mb-3">
      <select class="form-select" id="configType">
        <option value="singbox">SingBox (JSON)</option>
        <option value="clash">Clash (YAML)</option>
      </select>
    </div>
    <div class="mb-3">
      <textarea class="form-control" id="configEditor" rows="3" placeholder="Paste your custom config here..."></textarea>
    </div>
    <div class="d-flex gap-2">
      <button type="button" class="btn btn-secondary" onclick="saveConfig()">${t("saveConfig")}</button>
      <button type="button" class="btn btn-outline-danger" onclick="clearConfig()">
        <i class="fas fa-trash-alt me-2"></i>${t("clearConfig")}
      </button>
    </div>
  </div>
`, "generateBaseConfigSection");
  var generateUASection = /* @__PURE__ */ __name(() => `
  <div class="form-section">
    <div class="form-section-title d-flex align-items-center">
      ${t("UASettings")}
      <span class="tooltip-icon ms-2">
        <i class="fas fa-question-circle"></i>
        <span class="tooltip-content">
          ${t("UAtip")}
        </span>
      </span>
    </div>
    <input type="text" class="form-control" id="customUA" placeholder="curl/7.74.0">
  </div>
`, "generateUASection");
  var applyPredefinedRulesFunction = /* @__PURE__ */ __name(() => `
  function applyPredefinedRules() {
    const predefinedRules = document.getElementById('predefinedRules').value;
    const checkboxes = document.querySelectorAll('.rule-checkbox');
    
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });

    if (predefinedRules === 'custom') {
      return;
    }

    const rulesToApply = ${JSON.stringify(PREDEFINED_RULE_SETS)};
    
    rulesToApply[predefinedRules].forEach(rule => {
      const checkbox = document.getElementById(rule);
      if (checkbox) {
        checkbox.checked = true;
      }
    });
  }

  // Add event listeners to checkboxes
  document.addEventListener('DOMContentLoaded', function() {
    const checkboxes = document.querySelectorAll('.rule-checkbox');
    checkboxes.forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const predefinedSelect = document.getElementById('predefinedRules');
        if (predefinedSelect.value !== 'custom') {
          predefinedSelect.value = 'custom';
        }
      });
    });
  });
`, "applyPredefinedRulesFunction");
  var tooltipFunction = /* @__PURE__ */ __name(() => `
  function initTooltips() {
    const tooltips = document.querySelectorAll('.tooltip-icon');
    tooltips.forEach(tooltip => {
      tooltip.addEventListener('click', (e) => {
        e.stopPropagation();
        const content = tooltip.querySelector('.tooltip-content');
        content.style.display = content.style.display === 'block' ? 'none' : 'block';
      });
    });

    document.addEventListener('click', () => {
      const openTooltips = document.querySelectorAll('.tooltip-content[style="display: block;"]');
      openTooltips.forEach(tooltip => {
        tooltip.style.display = 'none';
      });
    });
  }

  document.addEventListener('DOMContentLoaded', initTooltips);
`, "tooltipFunction");
  var submitFormFunction = /* @__PURE__ */ __name(() => `
  function submitForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const inputString = formData.get('input');

    const userAgent = document.getElementById('customUA').value;
    
    // Save form data to localStorage
    localStorage.setItem('inputTextarea', inputString);
    localStorage.setItem('advancedToggle', document.getElementById('advancedToggle').checked);

    // Save UserAgent data to localStorage
    localStorage.setItem('userAgent', document.getElementById('customUA').value);
    
    // Save configEditor and configType to localStorage
    localStorage.setItem('configEditor', document.getElementById('configEditor').value);
    localStorage.setItem('configType', document.getElementById('configType').value);
    
    let selectedRules;
    const predefinedRules = document.getElementById('predefinedRules').value;
    if (predefinedRules !== 'custom') {
      selectedRules = predefinedRules;
    } else {
      selectedRules = Array.from(document.querySelectorAll('input[name="selectedRules"]:checked'))
        .map(checkbox => checkbox.value);
    }
    
    const configEditor = document.getElementById('configEditor');
    const configId = new URLSearchParams(window.location.search).get('configId') || '';

    const customRules = parseCustomRules();

    const configParam = configId ? \`&configId=\${configId}\` : '';
    const xrayUrl = \`\${window.location.origin}/xray?config=\${encodeURIComponent(inputString)}&ua=\${encodeURIComponent(userAgent)}\${configParam}\`;
    const singboxUrl = \`\${window.location.origin}/singbox?config=\${encodeURIComponent(inputString)}&ua=\${encodeURIComponent(userAgent)}&selectedRules=\${encodeURIComponent(JSON.stringify(selectedRules))}&customRules=\${encodeURIComponent(JSON.stringify(customRules))}\${configParam}\`;
    const clashUrl = \`\${window.location.origin}/clash?config=\${encodeURIComponent(inputString)}&ua=\${encodeURIComponent(userAgent)}&selectedRules=\${encodeURIComponent(JSON.stringify(selectedRules))}&customRules=\${encodeURIComponent(JSON.stringify(customRules))}\${configParam}\`;
    const surgeUrl = \`\${window.location.origin}/surge?config=\${encodeURIComponent(inputString)}&ua=\${encodeURIComponent(userAgent)}&selectedRules=\${encodeURIComponent(JSON.stringify(selectedRules))}&customRules=\${encodeURIComponent(JSON.stringify(customRules))}\${configParam}\`;
    document.getElementById('xrayLink').value = xrayUrl;
    document.getElementById('singboxLink').value = singboxUrl;
    document.getElementById('clashLink').value = clashUrl;
    document.getElementById('surgeLink').value = surgeUrl;
    // Show the subscribe part
    const subscribeLinksContainer = document.getElementById('subscribeLinksContainer');
    subscribeLinksContainer.classList.remove('hide');
    subscribeLinksContainer.classList.add('show');

    // Scroll to the subscribe part
    subscribeLinksContainer.scrollIntoView({ behavior: 'smooth' });
  }

  function parseUrlAndFillForm(url) {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      // Parse base configuration
      const config = params.get('config');
      if (config) {
        const decodedConfig = decodeURIComponent(config);
        document.getElementById('inputTextarea').value = decodedConfig;
      }

      // Parse UserAgent
      const ua = params.get('ua');
      if (ua) {
        document.getElementById('customUA').value = decodeURIComponent(ua);
      }

      // Parse rule selection
      const selectedRules = params.get('selectedRules');
      if (selectedRules) {
        try {
          const decodedRules = decodeURIComponent(selectedRules).replace(/^"|"$/g, '');
          // Check if it's a predefined rule set
          if (['minimal', 'balanced', 'comprehensive'].includes(decodedRules)) {
            const predefinedRules = document.getElementById('predefinedRules');
            predefinedRules.value = decodedRules;
            // Apply predefined rules to checkboxes
            const rulesToApply = ${JSON.stringify(PREDEFINED_RULE_SETS)};
            const checkboxes = document.querySelectorAll('.rule-checkbox');
            checkboxes.forEach(checkbox => {
              checkbox.checked = rulesToApply[decodedRules].includes(checkbox.value);
            });
          } else {
            // Handle custom rules (JSON array)
            const rules = JSON.parse(decodedRules);
            if (Array.isArray(rules)) {
              document.getElementById('predefinedRules').value = 'custom';
              const checkboxes = document.querySelectorAll('.rule-checkbox');
              checkboxes.forEach(checkbox => {
                checkbox.checked = rules.includes(checkbox.value);
              });
            }
          }
        } catch (e) {
          console.error('Error parsing selected rules:', e);
        }
      }

      // Parse custom rules
      const customRules = params.get('customRules');
      if (customRules) {
        try {
          const rules = JSON.parse(decodeURIComponent(customRules));
          if (Array.isArray(rules) && rules.length > 0) {
            // Clear existing custom rules
            document.querySelectorAll('.custom-rule').forEach(rule => rule.remove());
            
            // Switch to JSON view and write rules
            switchCustomRulesTab('json');
            const jsonTextarea = document.querySelector('#customRulesJSON textarea');
            if (jsonTextarea) {
              jsonTextarea.value = JSON.stringify(rules, null, 2);
              validateJSONRealtime(jsonTextarea);
            }
          }
        } catch (e) {
          console.error('Error parsing custom rules:', e);
        }
      }

      // Parse configuration ID
      const configId = params.get('configId');
      if (configId) {
        // Fetch configuration content
        fetch(\`/config?type=singbox&id=\${configId}\`)
          .then(response => response.json())
          .then(data => {
            if (data.content) {
              document.getElementById('configEditor').value = data.content;
              document.getElementById('configType').value = data.type || 'singbox';
            }
          })
          .catch(error => console.error('Error fetching config:', error));
      }

      // Show advanced options
      document.getElementById('advancedToggle').checked = true;
      document.getElementById('advancedOptions').classList.add('show');
    } catch (e) {
      console.error('Error parsing URL:', e);
    }
  }

  // \u68C0\u6D4B\u662F\u5426\u662F\u77ED\u94FE
  function isShortUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split('/');
      return pathParts.length >= 3 && ['b', 'c', 'x', 's'].includes(pathParts[1]) && pathParts[2];
    } catch (error) {
      return false;
    }
  }

  // \u81EA\u52A8\u89E3\u6790\u77ED\u94FE
  async function autoResolveShortUrl(shortUrl) {
    try {
      const response = await fetch(\`/resolve?url=\${encodeURIComponent(shortUrl)}\`);
      
      if (response.ok) {
        const data = await response.json();
        const originalUrl = data.originalUrl;
        
        // \u7528\u539F\u59CBURL\u66FF\u6362\u8F93\u5165\u6846\u4E2D\u7684\u77ED\u94FE
        document.getElementById('inputTextarea').value = originalUrl;
        
        // \u89E3\u6790\u539F\u59CBURL\u5230\u8868\u5355
        parseUrlAndFillForm(originalUrl);
        
        return true;
      } else {
        console.error('Failed to resolve short URL:', await response.text());
        return false;
      }
    } catch (error) {
      console.error('Error resolving short URL:', error);
      return false;
    }
  }

  // Add input box event listener
  document.addEventListener('DOMContentLoaded', function() {
    const inputTextarea = document.getElementById('inputTextarea');
    let lastValue = '';
    
    inputTextarea.addEventListener('input', async function() {
      const currentValue = this.value.trim();
      
      if (currentValue && currentValue !== lastValue) {
        // \u9996\u5148\u68C0\u67E5\u662F\u5426\u662F\u77ED\u94FE
        if (isShortUrl(currentValue)) {
          await autoResolveShortUrl(currentValue);
        }
        // \u7136\u540E\u68C0\u67E5\u662F\u5426\u662F\u9879\u76EE\u751F\u6210\u7684\u5B8C\u6574\u94FE\u63A5
        else if (currentValue.includes('/singbox?') || 
                 currentValue.includes('/clash?') || 
                 currentValue.includes('/surge?') || 
                 currentValue.includes('/xray?')) {
          parseUrlAndFillForm(currentValue);
        }
      }
      
      lastValue = currentValue;
    });
  });

  function loadSavedFormData() {
    const savedInput = localStorage.getItem('inputTextarea');
    if (savedInput) {
      document.getElementById('inputTextarea').value = savedInput;
    }

    const advancedToggle = localStorage.getItem('advancedToggle');
    if (advancedToggle) {
      document.getElementById('advancedToggle').checked = advancedToggle === 'true';
      if (advancedToggle === 'true') {
        document.getElementById('advancedOptions').classList.add('show');
      }
    }
    
    // Load userAgent
    const savedUA = localStorage.getItem('userAgent');
    if (savedUA) {
      document.getElementById('customUA').value = savedUA;
    }
    
    // Load configEditor and configType
    const savedConfig = localStorage.getItem('configEditor');
    const savedConfigType = localStorage.getItem('configType');
    
    if (savedConfig) {
      document.getElementById('configEditor').value = savedConfig;
    }
    if (savedConfigType) {
      document.getElementById('configType').value = savedConfigType;
    }
    
    const savedCustomPath = localStorage.getItem('customPath');
    if (savedCustomPath) {
      document.getElementById('customShortCode').value = savedCustomPath;
    }

    loadSelectedRules();
  }

  function saveSelectedRules() {
    const selectedRules = Array.from(document.querySelectorAll('input[name="selectedRules"]:checked'))
      .map(checkbox => checkbox.value);
    localStorage.setItem('selectedRules', JSON.stringify(selectedRules));
    localStorage.setItem('predefinedRules', document.getElementById('predefinedRules').value);
  }

  function loadSelectedRules() {
    const savedRules = localStorage.getItem('selectedRules');
    if (savedRules) {
      const rules = JSON.parse(savedRules);
      rules.forEach(rule => {
        const checkbox = document.querySelector(\`input[name="selectedRules"][value="\${rule}"]\`);
        if (checkbox) {
          checkbox.checked = true;
        }
      });
    }

    const savedPredefinedRules = localStorage.getItem('predefinedRules');
    if (savedPredefinedRules) {
      document.getElementById('predefinedRules').value = savedPredefinedRules;
    }
  }

  function clearFormData() {
    localStorage.removeItem('inputTextarea');
    localStorage.removeItem('advancedToggle');
    localStorage.removeItem('selectedRules');
    localStorage.removeItem('predefinedRules');
    localStorage.removeItem('configEditor'); 
    localStorage.removeItem('configType');
    localStorage.removeItem('userAgent');
    
    document.getElementById('inputTextarea').value = '';
    document.getElementById('advancedToggle').checked = false;
    document.getElementById('advancedOptions').classList.remove('show');
    document.getElementById('configEditor').value = '';
    document.getElementById('configType').value = 'singbox'; 
    document.getElementById('customUA').value = '';
    
    localStorage.removeItem('customPath');
    document.getElementById('customShortCode').value = '';

    const subscribeLinksContainer = document.getElementById('subscribeLinksContainer');
    subscribeLinksContainer.classList.remove('show');
    subscribeLinksContainer.classList.add('hide');

    document.getElementById('xrayLink').value = '';
    document.getElementById('singboxLink').value = '';
    document.getElementById('clashLink').value = '';

    // wait to reset the container
    setTimeout(() => {
      subscribeLinksContainer.classList.remove('hide');
    }, 500);
  }

  document.addEventListener('DOMContentLoaded', function() {
    loadSavedFormData();
    document.getElementById('encodeForm').addEventListener('submit', submitForm);
    document.getElementById('clearFormBtn').addEventListener('click', clearFormData);
  });
`, "submitFormFunction");
  var customRuleFunctions = /* @__PURE__ */ __name(() => `
  let customRuleCount = 0;
  let currentTab = 'form';

  function switchCustomRulesTab(tab) {
    try {
      currentTab = tab;

      // Update tab buttons
      document.querySelectorAll('.custom-rules-tab').forEach(btn => btn.classList.remove('active'));
      document.getElementById(tab + 'Tab').classList.add('active');

      // Update views
      document.querySelectorAll('.custom-rules-view').forEach(view => view.classList.remove('active'));
      document.getElementById(tab + 'View').classList.add('active');

      // Automatic view conversion
      if (tab === 'json') {
        convertFormToJSON();
      } else {
        convertJSONToForm();
      }

      updateEmptyMessages();
    } catch (error) {
      console.error('Error switching tabs:', error);
      // Ensure the view is correctly displayed if an error occurs during the switch
      document.querySelectorAll('.custom-rules-view').forEach(view => view.classList.remove('active'));
      document.getElementById(tab + 'View').classList.add('active');
    }
  }

  function updateEmptyMessages() {
    const hasFormRules = document.querySelectorAll('.custom-rule').length > 0;
    document.getElementById('emptyFormMessage').style.display = hasFormRules ? 'none' : 'block';
  }

  function addCustomRule() {
    const customRulesDiv = document.getElementById('customRules');
    const newRuleDiv = document.createElement('div');
    newRuleDiv.className = 'custom-rule mb-3 p-3 border rounded';
    newRuleDiv.dataset.ruleId = customRuleCount++;
    newRuleDiv.innerHTML = \`
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">${t("customRule")} #\${getNextRuleNumber()}</h6>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeRule(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="row">
        <div class="col-md-6 mb-2">
          <label class="form-label">${t("customRuleOutboundName")}</label>
          <input type="text" class="form-control" name="customRuleName[]" placeholder="${t("customRuleOutboundName")}" required>
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">${t("customRuleGeoSite")}</label>
          <span class="tooltip-icon">
            <i class="fas fa-question-circle"></i>
            <span class="tooltip-content">
              ${t("customRuleGeoSiteTooltip")}
            </span>
          </span>
          <input type="text" class="form-control" name="customRuleSite[]" placeholder="${t("customRuleGeoSitePlaceholder")}">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-2">
          <label class="form-label">${t("customRuleGeoIP")}</label>
          <span class="tooltip-icon">
            <i class="fas fa-question-circle"></i>
            <span class="tooltip-content">
              ${t("customRuleGeoIPTooltip")}
            </span>
          </span>
          <input type="text" class="form-control" name="customRuleIP[]" placeholder="${t("customRuleGeoIPPlaceholder")}">
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">${t("customRuleDomainSuffix")}</label>
          <input type="text" class="form-control" name="customRuleDomainSuffix[]" placeholder="${t("customRuleDomainSuffixPlaceholder")}">
        </div>
      </div>
      <div class="row">
        <div class="col-md-6 mb-2">
          <label class="form-label">${t("customRuleDomainKeyword")}</label>
          <input type="text" class="form-control" name="customRuleDomainKeyword[]" placeholder="${t("customRuleDomainKeywordPlaceholder")}">
        </div>
        <div class="col-md-6 mb-2">
          <label class="form-label">${t("customRuleIPCIDR")}</label>
          <input type="text" class="form-control" name="customRuleIPCIDR[]" placeholder="${t("customRuleIPCIDRPlaceholder")}">
        </div>
      </div>
      <div class="mb-2">
        <label class="form-label">${t("customRuleProtocol")}</label>
        <span class="tooltip-icon">
          <i class="fas fa-question-circle"></i>
          <span class="tooltip-content">
            ${t("customRuleProtocolTooltip")}
          </span>
        </span>
        <input type="text" class="form-control" name="customRuleProtocol[]" placeholder="${t("customRuleProtocolPlaceholder")}">
      </div>
    \`;
    customRulesDiv.appendChild(newRuleDiv);
    updateEmptyMessages();

    // Switch to form tab if not already there
    if (currentTab !== 'form') {
      switchCustomRulesTab('form');
    }
  }

  function clearAllCustomRules() {
    if (confirm('${t("confirmClearAllRules")}')) {
      document.querySelectorAll('.custom-rule').forEach(rule => rule.remove());
      document.querySelectorAll('.custom-rule-json').forEach(rule => rule.remove());
      customRuleCount = 0; 
      updateEmptyMessages();
    }
  }

  // Add a function to get the next rule number
  function getNextRuleNumber() {
    const existingRules = document.querySelectorAll('.custom-rule');
    return existingRules.length + 1;
  }

  // Modify the remove rule function to update the sequence number
  function removeRule(button) {
    const ruleDiv = button.closest('.custom-rule, .custom-rule-json');
    if (ruleDiv) {
      ruleDiv.remove();
      // Update the sequence number of the remaining rules
      document.querySelectorAll('.custom-rule').forEach((rule, index) => {
        const titleElement = rule.querySelector('h6');
        if (titleElement) {
          titleElement.textContent = \`${t("customRule")} #\${index + 1}\`;
        }
      });
      updateEmptyMessages();
    }
  }

  function convertFormToJSON() {
    const formRules = [];
    document.querySelectorAll('.custom-rule').forEach(rule => {
      const ruleData = {
        name: rule.querySelector('input[name="customRuleName[]"]').value || '',
        site: rule.querySelector('input[name="customRuleSite[]"]').value || '',
        ip: rule.querySelector('input[name="customRuleIP[]"]').value || '',
        domain_suffix: rule.querySelector('input[name="customRuleDomainSuffix[]"]').value || '',
        domain_keyword: rule.querySelector('input[name="customRuleDomainKeyword[]"]').value || '',
        ip_cidr: rule.querySelector('input[name="customRuleIPCIDR[]"]').value || '',
        protocol: rule.querySelector('input[name="customRuleProtocol[]"]').value || ''
      };

      // Only add rules that have at least a name
      if (ruleData.name.trim()) {
        formRules.push(ruleData);
      }
    });

    // Update JSON editor content
    const jsonTextarea = document.querySelector('#customRulesJSON textarea');
    if (jsonTextarea) {
      jsonTextarea.value = JSON.stringify(formRules, null, 2);
      validateJSONRealtime(jsonTextarea);
    }
  }

  function convertJSONToForm() {
    const jsonTextarea = document.querySelector('#customRulesJSON textarea');
    if (!jsonTextarea || !jsonTextarea.value.trim()) {
      return;
    }

    try {
      const rules = JSON.parse(jsonTextarea.value.trim());
      if (!Array.isArray(rules)) {
        throw new Error('${t("mustBeArray")}');
      }

      // Clear existing form rules
      document.querySelectorAll('.custom-rule').forEach(rule => rule.remove());

      // Convert each JSON rule to form
      rules.forEach((ruleData, index) => {
        if (ruleData && ruleData.name) {
          const customRulesDiv = document.getElementById('customRules');
          const newRuleDiv = document.createElement('div');
          newRuleDiv.className = 'custom-rule mb-3 p-3 border rounded';
          newRuleDiv.innerHTML = \`
            <div class="d-flex justify-content-between align-items-center mb-2">
              <h6 class="mb-0">${t("customRule")} #\${index + 1}</h6>
              <button type="button" class="btn btn-danger btn-sm" onclick="removeRule(this)">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="row">
              <div class="col-md-6 mb-2">
                <label class="form-label">${t("customRuleOutboundName")}</label>
                <input type="text" class="form-control" name="customRuleName[]" value="\${ruleData.name || ''}" required>
              </div>
              <div class="col-md-6 mb-2">
                <label class="form-label">${t("customRuleGeoSite")}</label>
                <input type="text" class="form-control" name="customRuleSite[]" value="\${ruleData.site || ''}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-2">
                <label class="form-label">${t("customRuleGeoIP")}</label>
                <input type="text" class="form-control" name="customRuleIP[]" value="\${ruleData.ip || ''}">
              </div>
              <div class="col-md-6 mb-2">
                <label class="form-label">${t("customRuleDomainSuffix")}</label>
                <input type="text" class="form-control" name="customRuleDomainSuffix[]" value="\${ruleData.domain_suffix || ''}">
              </div>
            </div>
            <div class="row">
              <div class="col-md-6 mb-2">
                <label class="form-label">${t("customRuleDomainKeyword")}</label>
                <input type="text" class="form-control" name="customRuleDomainKeyword[]" value="\${ruleData.domain_keyword || ''}">
              </div>
              <div class="col-md-6 mb-2">
                <label class="form-label">${t("customRuleIPCIDR")}</label>
                <input type="text" class="form-control" name="customRuleIPCIDR[]" value="\${ruleData.ip_cidr || ''}">
              </div>
            </div>
            <div class="mb-2">
              <label class="form-label">${t("customRuleProtocol")}</label>
              <input type="text" class="form-control" name="customRuleProtocol[]" value="\${ruleData.protocol || ''}">
            </div>
          \`;
          customRulesDiv.appendChild(newRuleDiv);
        }
      });
    } catch (error) {
      console.error('Error converting JSON to form:', error);
      // If an error occurs during the conversion, clear the form view
      document.querySelectorAll('.custom-rule').forEach(rule => rule.remove());
    }

    updateEmptyMessages();
  }

  function validateJSONRealtime(textarea) {
    const messageDiv = textarea.parentNode.querySelector('.json-validation-message');
    const jsonText = textarea.value.trim();
    // Clear previous validation state
    textarea.classList.remove('json-valid', 'json-invalid');
    messageDiv.style.display = 'none';
    messageDiv.classList.remove('valid', 'invalid');
    if (!jsonText) {
      return; // Don't validate empty textarea
    }
    try {
      const rules = JSON.parse(jsonText);
      if (!Array.isArray(rules)) {
        throw new Error('${t("mustBeArray")}');
      }
      const errors = [];
      rules.forEach((ruleData, ruleIndex) => {
        if (!ruleData.name || !ruleData.name.trim()) {
          errors.push(\`${t("rule")} #\${ruleIndex + 1}: ${t("nameRequired")}\`);
        }
      });
      if (errors.length > 0) {
        throw new Error(errors.join('; '));
      }
      // Valid JSON
      textarea.classList.add('json-valid');
      messageDiv.textContent = \`\u2713 ${t("validJSON")} (\${rules.length} ${t("rules")})\`;
      messageDiv.classList.add('valid');
      messageDiv.style.display = 'block';
    } catch (error) {
      // Invalid JSON
      textarea.classList.add('json-invalid');
      messageDiv.textContent = \`\u2717 \${error.message}\`;
      messageDiv.classList.add('invalid');
      messageDiv.style.display = 'block';
    }
  }

  function validateJSON() {
    let allValid = true;
    let errorMessages = [];
    document.querySelectorAll('.custom-rule-json').forEach((rule, index) => {
      const textarea = rule.querySelector('textarea[name="customRuleJSON[]"]');
      validateJSONRealtime(textarea);
      if (textarea.classList.contains('json-invalid')) {
        allValid = false;
        const messageDiv = textarea.parentNode.querySelector('.json-validation-message');
        errorMessages.push(\`JSON #\${index + 1}: \${messageDiv.textContent.replace('\u2717 ', '')}\`);
      }
    });
    if (allValid) {
      alert('${t("allJSONValid")}');
    } else {
      alert('${t("jsonValidationErrors")}:\\n\\n' + errorMessages.join('\\n'));
    }
  }

  function parseCustomRules() {
    const customRules = [];

    // Process ordinary form rules
    document.querySelectorAll('.custom-rule').forEach(rule => {
      const ruleData = {
        name: rule.querySelector('input[name="customRuleName[]"]').value || '',
        site: rule.querySelector('input[name="customRuleSite[]"]').value || '',
        ip: rule.querySelector('input[name="customRuleIP[]"]').value || '',
        domain_suffix: rule.querySelector('input[name="customRuleDomainSuffix[]"]').value || '',
        domain_keyword: rule.querySelector('input[name="customRuleDomainKeyword[]"]').value || '',
        ip_cidr: rule.querySelector('input[name="customRuleIPCIDR[]"]').value || '',
        protocol: rule.querySelector('input[name="customRuleProtocol[]"]').value || ''
      };

      if (ruleData.name.trim()) {
        customRules.push(ruleData);
      }
    });

    // Process JSON rules
    const jsonTextarea = document.querySelector('#customRulesJSON textarea');
    if (jsonTextarea && jsonTextarea.value.trim()) {
      try {
        const jsonRules = JSON.parse(jsonTextarea.value.trim());
        if (Array.isArray(jsonRules)) {
          customRules.push(...jsonRules.filter(r => r.name && r.name.trim()));
        }
      } catch (error) {
        console.error('Error parsing JSON rules:', error);
      }
    }

    return customRules;
  }

  // Initialize interface state
  document.addEventListener('DOMContentLoaded', function() {
    updateEmptyMessages();

    // Initialize real-time validation for JSON textarea
    const jsonTextarea = document.querySelector('#customRulesJSON textarea');
    if (jsonTextarea && jsonTextarea.value.trim()) {
      validateJSONRealtime(jsonTextarea);
    }

    // Initialize tooltips for dynamically added content
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach(function(node) {
            if (node.nodeType === 1 && node.querySelectorAll) {
              initTooltips();
            }
          });
        }
      });
    });

    observer.observe(document.getElementById('customRules'), { childList: true, subtree: true });
  });

  function addCustomRuleJSON() {
    const customRulesJSONDiv = document.getElementById('customRulesJSON');
    const newRuleDiv = document.createElement('div');
    newRuleDiv.className = 'custom-rule-json mb-3 p-3 border rounded';
    newRuleDiv.dataset.ruleId = customRuleCount++;
    newRuleDiv.innerHTML = \`
      <div class="d-flex justify-content-between align-items-center mb-2">
        <h6 class="mb-0">${t("customRuleJSON")}</h6>
        <button type="button" class="btn btn-danger btn-sm" onclick="removeRule(this)">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="mb-2">
        <label class="form-label">${t("customRuleJSON")}</label>
        <div class="json-textarea-container">
          <textarea class="form-control json-textarea" name="customRuleJSON[]" rows="15"
                    oninput="validateJSONRealtime(this)"></textarea>
          <div class="json-validation-message" style="display: none;"></div>
        </div>
      </div>
    \`;
    customRulesJSONDiv.appendChild(newRuleDiv);
    updateEmptyMessages();
  }
`, "customRuleFunctions");
  var generateQRCodeFunction = /* @__PURE__ */ __name(() => `
  function generateQRCode(id) {
    const input = document.getElementById(id);
    const text = input.value;
    if (!text) {
      alert('No link provided!');
      return;
    }
    try {
      const qr = qrcode(0, 'M');
      qr.addData(text);
      qr.make();

      const moduleCount = qr.getModuleCount();
      const cellSize = Math.max(2, Math.min(8, Math.floor(300 / moduleCount)));
      const margin = Math.floor(cellSize * 0.5);

      const qrImage = qr.createDataURL(cellSize, margin);
      
      const modal = document.createElement('div');
      modal.className = 'qr-modal';
      modal.innerHTML = \`
        <div class="qr-card">
          <img src="\${qrImage}" alt="QR Code">
          <p>Scan QR Code</p>
        </div>
      \`;

      document.body.appendChild(modal);

      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeQRModal();
        }
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          closeQRModal();
        }
      });

      requestAnimationFrame(() => {
        modal.classList.add('show');
      });
    } catch (error) {
      console.error('Error in generating:', error);
      alert('Try to use short links!');
    }
  }

  function closeQRModal() {
    const modal = document.querySelector('.qr-modal');
    if (modal) {
      modal.classList.remove('show');
      modal.addEventListener('transitionend', () => {
        document.body.removeChild(modal);
      }, { once: true });
    }
  }
`, "generateQRCodeFunction");
  var saveConfig = /* @__PURE__ */ __name(() => `
  function saveConfig() {
    const configEditor = document.getElementById('configEditor');
    const configType = document.getElementById('configType').value;
    const config = configEditor.value;

    localStorage.setItem('configEditor', config);
    localStorage.setItem('configType', configType);
    
    fetch('/config?type=' + configType, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: configType,
        content: config
      })
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to save configuration');
      }
      return response.text();
    })
    .then(configId => {
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('configId', configId);
      window.history.pushState({}, '', currentUrl);
      alert('Configuration saved successfully!');
    })
    .catch(error => {
      alert('Error: ' + error.message);
    });
  }
`, "saveConfig");
  var clearConfig = /* @__PURE__ */ __name(() => `
  function clearConfig() {
    document.getElementById('configEditor').value = '';
    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete('configId');
    window.history.pushState({}, '', currentUrl);
    localStorage.removeItem('configEditor');
  }
`, "clearConfig");

  // node_modules/.pnpm/js-yaml@4.1.0/node_modules/js-yaml/dist/js-yaml.mjs
  function isNothing(subject) {
    return typeof subject === "undefined" || subject === null;
  }
  __name(isNothing, "isNothing");
  function isObject(subject) {
    return typeof subject === "object" && subject !== null;
  }
  __name(isObject, "isObject");
  function toArray(sequence) {
    if (Array.isArray(sequence))
      return sequence;
    else if (isNothing(sequence))
      return [];
    return [sequence];
  }
  __name(toArray, "toArray");
  function extend(target, source) {
    var index, length, key, sourceKeys;
    if (source) {
      sourceKeys = Object.keys(source);
      for (index = 0, length = sourceKeys.length; index < length; index += 1) {
        key = sourceKeys[index];
        target[key] = source[key];
      }
    }
    return target;
  }
  __name(extend, "extend");
  function repeat(string, count) {
    var result = "", cycle;
    for (cycle = 0; cycle < count; cycle += 1) {
      result += string;
    }
    return result;
  }
  __name(repeat, "repeat");
  function isNegativeZero(number) {
    return number === 0 && Number.NEGATIVE_INFINITY === 1 / number;
  }
  __name(isNegativeZero, "isNegativeZero");
  var isNothing_1 = isNothing;
  var isObject_1 = isObject;
  var toArray_1 = toArray;
  var repeat_1 = repeat;
  var isNegativeZero_1 = isNegativeZero;
  var extend_1 = extend;
  var common = {
    isNothing: isNothing_1,
    isObject: isObject_1,
    toArray: toArray_1,
    repeat: repeat_1,
    isNegativeZero: isNegativeZero_1,
    extend: extend_1
  };
  function formatError(exception2, compact) {
    var where = "", message = exception2.reason || "(unknown reason)";
    if (!exception2.mark)
      return message;
    if (exception2.mark.name) {
      where += 'in "' + exception2.mark.name + '" ';
    }
    where += "(" + (exception2.mark.line + 1) + ":" + (exception2.mark.column + 1) + ")";
    if (!compact && exception2.mark.snippet) {
      where += "\n\n" + exception2.mark.snippet;
    }
    return message + " " + where;
  }
  __name(formatError, "formatError");
  function YAMLException$1(reason, mark) {
    Error.call(this);
    this.name = "YAMLException";
    this.reason = reason;
    this.mark = mark;
    this.message = formatError(this, false);
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error().stack || "";
    }
  }
  __name(YAMLException$1, "YAMLException$1");
  YAMLException$1.prototype = Object.create(Error.prototype);
  YAMLException$1.prototype.constructor = YAMLException$1;
  YAMLException$1.prototype.toString = /* @__PURE__ */ __name(function toString(compact) {
    return this.name + ": " + formatError(this, compact);
  }, "toString");
  var exception = YAMLException$1;
  function getLine(buffer, lineStart, lineEnd, position, maxLineLength) {
    var head = "";
    var tail = "";
    var maxHalfLength = Math.floor(maxLineLength / 2) - 1;
    if (position - lineStart > maxHalfLength) {
      head = " ... ";
      lineStart = position - maxHalfLength + head.length;
    }
    if (lineEnd - position > maxHalfLength) {
      tail = " ...";
      lineEnd = position + maxHalfLength - tail.length;
    }
    return {
      str: head + buffer.slice(lineStart, lineEnd).replace(/\t/g, "\u2192") + tail,
      pos: position - lineStart + head.length
      // relative position
    };
  }
  __name(getLine, "getLine");
  function padStart(string, max) {
    return common.repeat(" ", max - string.length) + string;
  }
  __name(padStart, "padStart");
  function makeSnippet(mark, options) {
    options = Object.create(options || null);
    if (!mark.buffer)
      return null;
    if (!options.maxLength)
      options.maxLength = 79;
    if (typeof options.indent !== "number")
      options.indent = 1;
    if (typeof options.linesBefore !== "number")
      options.linesBefore = 3;
    if (typeof options.linesAfter !== "number")
      options.linesAfter = 2;
    var re = /\r?\n|\r|\0/g;
    var lineStarts = [0];
    var lineEnds = [];
    var match;
    var foundLineNo = -1;
    while (match = re.exec(mark.buffer)) {
      lineEnds.push(match.index);
      lineStarts.push(match.index + match[0].length);
      if (mark.position <= match.index && foundLineNo < 0) {
        foundLineNo = lineStarts.length - 2;
      }
    }
    if (foundLineNo < 0)
      foundLineNo = lineStarts.length - 1;
    var result = "", i, line;
    var lineNoLength = Math.min(mark.line + options.linesAfter, lineEnds.length).toString().length;
    var maxLineLength = options.maxLength - (options.indent + lineNoLength + 3);
    for (i = 1; i <= options.linesBefore; i++) {
      if (foundLineNo - i < 0)
        break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo - i],
        lineEnds[foundLineNo - i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo - i]),
        maxLineLength
      );
      result = common.repeat(" ", options.indent) + padStart((mark.line - i + 1).toString(), lineNoLength) + " | " + line.str + "\n" + result;
    }
    line = getLine(mark.buffer, lineStarts[foundLineNo], lineEnds[foundLineNo], mark.position, maxLineLength);
    result += common.repeat(" ", options.indent) + padStart((mark.line + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    result += common.repeat("-", options.indent + lineNoLength + 3 + line.pos) + "^\n";
    for (i = 1; i <= options.linesAfter; i++) {
      if (foundLineNo + i >= lineEnds.length)
        break;
      line = getLine(
        mark.buffer,
        lineStarts[foundLineNo + i],
        lineEnds[foundLineNo + i],
        mark.position - (lineStarts[foundLineNo] - lineStarts[foundLineNo + i]),
        maxLineLength
      );
      result += common.repeat(" ", options.indent) + padStart((mark.line + i + 1).toString(), lineNoLength) + " | " + line.str + "\n";
    }
    return result.replace(/\n$/, "");
  }
  __name(makeSnippet, "makeSnippet");
  var snippet = makeSnippet;
  var TYPE_CONSTRUCTOR_OPTIONS = [
    "kind",
    "multi",
    "resolve",
    "construct",
    "instanceOf",
    "predicate",
    "represent",
    "representName",
    "defaultStyle",
    "styleAliases"
  ];
  var YAML_NODE_KINDS = [
    "scalar",
    "sequence",
    "mapping"
  ];
  function compileStyleAliases(map2) {
    var result = {};
    if (map2 !== null) {
      Object.keys(map2).forEach(function(style) {
        map2[style].forEach(function(alias) {
          result[String(alias)] = style;
        });
      });
    }
    return result;
  }
  __name(compileStyleAliases, "compileStyleAliases");
  function Type$1(tag, options) {
    options = options || {};
    Object.keys(options).forEach(function(name) {
      if (TYPE_CONSTRUCTOR_OPTIONS.indexOf(name) === -1) {
        throw new exception('Unknown option "' + name + '" is met in definition of "' + tag + '" YAML type.');
      }
    });
    this.options = options;
    this.tag = tag;
    this.kind = options["kind"] || null;
    this.resolve = options["resolve"] || function() {
      return true;
    };
    this.construct = options["construct"] || function(data) {
      return data;
    };
    this.instanceOf = options["instanceOf"] || null;
    this.predicate = options["predicate"] || null;
    this.represent = options["represent"] || null;
    this.representName = options["representName"] || null;
    this.defaultStyle = options["defaultStyle"] || null;
    this.multi = options["multi"] || false;
    this.styleAliases = compileStyleAliases(options["styleAliases"] || null);
    if (YAML_NODE_KINDS.indexOf(this.kind) === -1) {
      throw new exception('Unknown kind "' + this.kind + '" is specified for "' + tag + '" YAML type.');
    }
  }
  __name(Type$1, "Type$1");
  var type = Type$1;
  function compileList(schema2, name) {
    var result = [];
    schema2[name].forEach(function(currentType) {
      var newIndex = result.length;
      result.forEach(function(previousType, previousIndex) {
        if (previousType.tag === currentType.tag && previousType.kind === currentType.kind && previousType.multi === currentType.multi) {
          newIndex = previousIndex;
        }
      });
      result[newIndex] = currentType;
    });
    return result;
  }
  __name(compileList, "compileList");
  function compileMap() {
    var result = {
      scalar: {},
      sequence: {},
      mapping: {},
      fallback: {},
      multi: {
        scalar: [],
        sequence: [],
        mapping: [],
        fallback: []
      }
    }, index, length;
    function collectType(type2) {
      if (type2.multi) {
        result.multi[type2.kind].push(type2);
        result.multi["fallback"].push(type2);
      } else {
        result[type2.kind][type2.tag] = result["fallback"][type2.tag] = type2;
      }
    }
    __name(collectType, "collectType");
    for (index = 0, length = arguments.length; index < length; index += 1) {
      arguments[index].forEach(collectType);
    }
    return result;
  }
  __name(compileMap, "compileMap");
  function Schema$1(definition) {
    return this.extend(definition);
  }
  __name(Schema$1, "Schema$1");
  Schema$1.prototype.extend = /* @__PURE__ */ __name(function extend2(definition) {
    var implicit = [];
    var explicit = [];
    if (definition instanceof type) {
      explicit.push(definition);
    } else if (Array.isArray(definition)) {
      explicit = explicit.concat(definition);
    } else if (definition && (Array.isArray(definition.implicit) || Array.isArray(definition.explicit))) {
      if (definition.implicit)
        implicit = implicit.concat(definition.implicit);
      if (definition.explicit)
        explicit = explicit.concat(definition.explicit);
    } else {
      throw new exception("Schema.extend argument should be a Type, [ Type ], or a schema definition ({ implicit: [...], explicit: [...] })");
    }
    implicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
      if (type$1.loadKind && type$1.loadKind !== "scalar") {
        throw new exception("There is a non-scalar type in the implicit list of a schema. Implicit resolving of such types is not supported.");
      }
      if (type$1.multi) {
        throw new exception("There is a multi type in the implicit list of a schema. Multi tags can only be listed as explicit.");
      }
    });
    explicit.forEach(function(type$1) {
      if (!(type$1 instanceof type)) {
        throw new exception("Specified list of YAML types (or a single Type object) contains a non-Type object.");
      }
    });
    var result = Object.create(Schema$1.prototype);
    result.implicit = (this.implicit || []).concat(implicit);
    result.explicit = (this.explicit || []).concat(explicit);
    result.compiledImplicit = compileList(result, "implicit");
    result.compiledExplicit = compileList(result, "explicit");
    result.compiledTypeMap = compileMap(result.compiledImplicit, result.compiledExplicit);
    return result;
  }, "extend");
  var schema = Schema$1;
  var str = new type("tag:yaml.org,2002:str", {
    kind: "scalar",
    construct: function(data) {
      return data !== null ? data : "";
    }
  });
  var seq = new type("tag:yaml.org,2002:seq", {
    kind: "sequence",
    construct: function(data) {
      return data !== null ? data : [];
    }
  });
  var map = new type("tag:yaml.org,2002:map", {
    kind: "mapping",
    construct: function(data) {
      return data !== null ? data : {};
    }
  });
  var failsafe = new schema({
    explicit: [
      str,
      seq,
      map
    ]
  });
  function resolveYamlNull(data) {
    if (data === null)
      return true;
    var max = data.length;
    return max === 1 && data === "~" || max === 4 && (data === "null" || data === "Null" || data === "NULL");
  }
  __name(resolveYamlNull, "resolveYamlNull");
  function constructYamlNull() {
    return null;
  }
  __name(constructYamlNull, "constructYamlNull");
  function isNull(object) {
    return object === null;
  }
  __name(isNull, "isNull");
  var _null = new type("tag:yaml.org,2002:null", {
    kind: "scalar",
    resolve: resolveYamlNull,
    construct: constructYamlNull,
    predicate: isNull,
    represent: {
      canonical: function() {
        return "~";
      },
      lowercase: function() {
        return "null";
      },
      uppercase: function() {
        return "NULL";
      },
      camelcase: function() {
        return "Null";
      },
      empty: function() {
        return "";
      }
    },
    defaultStyle: "lowercase"
  });
  function resolveYamlBoolean(data) {
    if (data === null)
      return false;
    var max = data.length;
    return max === 4 && (data === "true" || data === "True" || data === "TRUE") || max === 5 && (data === "false" || data === "False" || data === "FALSE");
  }
  __name(resolveYamlBoolean, "resolveYamlBoolean");
  function constructYamlBoolean(data) {
    return data === "true" || data === "True" || data === "TRUE";
  }
  __name(constructYamlBoolean, "constructYamlBoolean");
  function isBoolean(object) {
    return Object.prototype.toString.call(object) === "[object Boolean]";
  }
  __name(isBoolean, "isBoolean");
  var bool = new type("tag:yaml.org,2002:bool", {
    kind: "scalar",
    resolve: resolveYamlBoolean,
    construct: constructYamlBoolean,
    predicate: isBoolean,
    represent: {
      lowercase: function(object) {
        return object ? "true" : "false";
      },
      uppercase: function(object) {
        return object ? "TRUE" : "FALSE";
      },
      camelcase: function(object) {
        return object ? "True" : "False";
      }
    },
    defaultStyle: "lowercase"
  });
  function isHexCode(c) {
    return 48 <= c && c <= 57 || 65 <= c && c <= 70 || 97 <= c && c <= 102;
  }
  __name(isHexCode, "isHexCode");
  function isOctCode(c) {
    return 48 <= c && c <= 55;
  }
  __name(isOctCode, "isOctCode");
  function isDecCode(c) {
    return 48 <= c && c <= 57;
  }
  __name(isDecCode, "isDecCode");
  function resolveYamlInteger(data) {
    if (data === null)
      return false;
    var max = data.length, index = 0, hasDigits = false, ch;
    if (!max)
      return false;
    ch = data[index];
    if (ch === "-" || ch === "+") {
      ch = data[++index];
    }
    if (ch === "0") {
      if (index + 1 === max)
        return true;
      ch = data[++index];
      if (ch === "b") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_")
            continue;
          if (ch !== "0" && ch !== "1")
            return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "x") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_")
            continue;
          if (!isHexCode(data.charCodeAt(index)))
            return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
      if (ch === "o") {
        index++;
        for (; index < max; index++) {
          ch = data[index];
          if (ch === "_")
            continue;
          if (!isOctCode(data.charCodeAt(index)))
            return false;
          hasDigits = true;
        }
        return hasDigits && ch !== "_";
      }
    }
    if (ch === "_")
      return false;
    for (; index < max; index++) {
      ch = data[index];
      if (ch === "_")
        continue;
      if (!isDecCode(data.charCodeAt(index))) {
        return false;
      }
      hasDigits = true;
    }
    if (!hasDigits || ch === "_")
      return false;
    return true;
  }
  __name(resolveYamlInteger, "resolveYamlInteger");
  function constructYamlInteger(data) {
    var value = data, sign = 1, ch;
    if (value.indexOf("_") !== -1) {
      value = value.replace(/_/g, "");
    }
    ch = value[0];
    if (ch === "-" || ch === "+") {
      if (ch === "-")
        sign = -1;
      value = value.slice(1);
      ch = value[0];
    }
    if (value === "0")
      return 0;
    if (ch === "0") {
      if (value[1] === "b")
        return sign * parseInt(value.slice(2), 2);
      if (value[1] === "x")
        return sign * parseInt(value.slice(2), 16);
      if (value[1] === "o")
        return sign * parseInt(value.slice(2), 8);
    }
    return sign * parseInt(value, 10);
  }
  __name(constructYamlInteger, "constructYamlInteger");
  function isInteger(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 === 0 && !common.isNegativeZero(object));
  }
  __name(isInteger, "isInteger");
  var int = new type("tag:yaml.org,2002:int", {
    kind: "scalar",
    resolve: resolveYamlInteger,
    construct: constructYamlInteger,
    predicate: isInteger,
    represent: {
      binary: function(obj) {
        return obj >= 0 ? "0b" + obj.toString(2) : "-0b" + obj.toString(2).slice(1);
      },
      octal: function(obj) {
        return obj >= 0 ? "0o" + obj.toString(8) : "-0o" + obj.toString(8).slice(1);
      },
      decimal: function(obj) {
        return obj.toString(10);
      },
      /* eslint-disable max-len */
      hexadecimal: function(obj) {
        return obj >= 0 ? "0x" + obj.toString(16).toUpperCase() : "-0x" + obj.toString(16).toUpperCase().slice(1);
      }
    },
    defaultStyle: "decimal",
    styleAliases: {
      binary: [2, "bin"],
      octal: [8, "oct"],
      decimal: [10, "dec"],
      hexadecimal: [16, "hex"]
    }
  });
  var YAML_FLOAT_PATTERN = new RegExp(
    // 2.5e4, 2.5 and integers
    "^(?:[-+]?(?:[0-9][0-9_]*)(?:\\.[0-9_]*)?(?:[eE][-+]?[0-9]+)?|\\.[0-9_]+(?:[eE][-+]?[0-9]+)?|[-+]?\\.(?:inf|Inf|INF)|\\.(?:nan|NaN|NAN))$"
  );
  function resolveYamlFloat(data) {
    if (data === null)
      return false;
    if (!YAML_FLOAT_PATTERN.test(data) || // Quick hack to not allow integers end with `_`
    // Probably should update regexp & check speed
    data[data.length - 1] === "_") {
      return false;
    }
    return true;
  }
  __name(resolveYamlFloat, "resolveYamlFloat");
  function constructYamlFloat(data) {
    var value, sign;
    value = data.replace(/_/g, "").toLowerCase();
    sign = value[0] === "-" ? -1 : 1;
    if ("+-".indexOf(value[0]) >= 0) {
      value = value.slice(1);
    }
    if (value === ".inf") {
      return sign === 1 ? Number.POSITIVE_INFINITY : Number.NEGATIVE_INFINITY;
    } else if (value === ".nan") {
      return NaN;
    }
    return sign * parseFloat(value, 10);
  }
  __name(constructYamlFloat, "constructYamlFloat");
  var SCIENTIFIC_WITHOUT_DOT = /^[-+]?[0-9]+e/;
  function representYamlFloat(object, style) {
    var res;
    if (isNaN(object)) {
      switch (style) {
        case "lowercase":
          return ".nan";
        case "uppercase":
          return ".NAN";
        case "camelcase":
          return ".NaN";
      }
    } else if (Number.POSITIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return ".inf";
        case "uppercase":
          return ".INF";
        case "camelcase":
          return ".Inf";
      }
    } else if (Number.NEGATIVE_INFINITY === object) {
      switch (style) {
        case "lowercase":
          return "-.inf";
        case "uppercase":
          return "-.INF";
        case "camelcase":
          return "-.Inf";
      }
    } else if (common.isNegativeZero(object)) {
      return "-0.0";
    }
    res = object.toString(10);
    return SCIENTIFIC_WITHOUT_DOT.test(res) ? res.replace("e", ".e") : res;
  }
  __name(representYamlFloat, "representYamlFloat");
  function isFloat(object) {
    return Object.prototype.toString.call(object) === "[object Number]" && (object % 1 !== 0 || common.isNegativeZero(object));
  }
  __name(isFloat, "isFloat");
  var float = new type("tag:yaml.org,2002:float", {
    kind: "scalar",
    resolve: resolveYamlFloat,
    construct: constructYamlFloat,
    predicate: isFloat,
    represent: representYamlFloat,
    defaultStyle: "lowercase"
  });
  var json = failsafe.extend({
    implicit: [
      _null,
      bool,
      int,
      float
    ]
  });
  var core = json;
  var YAML_DATE_REGEXP = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9])-([0-9][0-9])$"
  );
  var YAML_TIMESTAMP_REGEXP = new RegExp(
    "^([0-9][0-9][0-9][0-9])-([0-9][0-9]?)-([0-9][0-9]?)(?:[Tt]|[ \\t]+)([0-9][0-9]?):([0-9][0-9]):([0-9][0-9])(?:\\.([0-9]*))?(?:[ \\t]*(Z|([-+])([0-9][0-9]?)(?::([0-9][0-9]))?))?$"
  );
  function resolveYamlTimestamp(data) {
    if (data === null)
      return false;
    if (YAML_DATE_REGEXP.exec(data) !== null)
      return true;
    if (YAML_TIMESTAMP_REGEXP.exec(data) !== null)
      return true;
    return false;
  }
  __name(resolveYamlTimestamp, "resolveYamlTimestamp");
  function constructYamlTimestamp(data) {
    var match, year, month, day, hour, minute, second, fraction = 0, delta = null, tz_hour, tz_minute, date;
    match = YAML_DATE_REGEXP.exec(data);
    if (match === null)
      match = YAML_TIMESTAMP_REGEXP.exec(data);
    if (match === null)
      throw new Error("Date resolve error");
    year = +match[1];
    month = +match[2] - 1;
    day = +match[3];
    if (!match[4]) {
      return new Date(Date.UTC(year, month, day));
    }
    hour = +match[4];
    minute = +match[5];
    second = +match[6];
    if (match[7]) {
      fraction = match[7].slice(0, 3);
      while (fraction.length < 3) {
        fraction += "0";
      }
      fraction = +fraction;
    }
    if (match[9]) {
      tz_hour = +match[10];
      tz_minute = +(match[11] || 0);
      delta = (tz_hour * 60 + tz_minute) * 6e4;
      if (match[9] === "-")
        delta = -delta;
    }
    date = new Date(Date.UTC(year, month, day, hour, minute, second, fraction));
    if (delta)
      date.setTime(date.getTime() - delta);
    return date;
  }
  __name(constructYamlTimestamp, "constructYamlTimestamp");
  function representYamlTimestamp(object) {
    return object.toISOString();
  }
  __name(representYamlTimestamp, "representYamlTimestamp");
  var timestamp = new type("tag:yaml.org,2002:timestamp", {
    kind: "scalar",
    resolve: resolveYamlTimestamp,
    construct: constructYamlTimestamp,
    instanceOf: Date,
    represent: representYamlTimestamp
  });
  function resolveYamlMerge(data) {
    return data === "<<" || data === null;
  }
  __name(resolveYamlMerge, "resolveYamlMerge");
  var merge = new type("tag:yaml.org,2002:merge", {
    kind: "scalar",
    resolve: resolveYamlMerge
  });
  var BASE64_MAP = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=\n\r";
  function resolveYamlBinary(data) {
    if (data === null)
      return false;
    var code, idx, bitlen = 0, max = data.length, map2 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      code = map2.indexOf(data.charAt(idx));
      if (code > 64)
        continue;
      if (code < 0)
        return false;
      bitlen += 6;
    }
    return bitlen % 8 === 0;
  }
  __name(resolveYamlBinary, "resolveYamlBinary");
  function constructYamlBinary(data) {
    var idx, tailbits, input = data.replace(/[\r\n=]/g, ""), max = input.length, map2 = BASE64_MAP, bits = 0, result = [];
    for (idx = 0; idx < max; idx++) {
      if (idx % 4 === 0 && idx) {
        result.push(bits >> 16 & 255);
        result.push(bits >> 8 & 255);
        result.push(bits & 255);
      }
      bits = bits << 6 | map2.indexOf(input.charAt(idx));
    }
    tailbits = max % 4 * 6;
    if (tailbits === 0) {
      result.push(bits >> 16 & 255);
      result.push(bits >> 8 & 255);
      result.push(bits & 255);
    } else if (tailbits === 18) {
      result.push(bits >> 10 & 255);
      result.push(bits >> 2 & 255);
    } else if (tailbits === 12) {
      result.push(bits >> 4 & 255);
    }
    return new Uint8Array(result);
  }
  __name(constructYamlBinary, "constructYamlBinary");
  function representYamlBinary(object) {
    var result = "", bits = 0, idx, tail, max = object.length, map2 = BASE64_MAP;
    for (idx = 0; idx < max; idx++) {
      if (idx % 3 === 0 && idx) {
        result += map2[bits >> 18 & 63];
        result += map2[bits >> 12 & 63];
        result += map2[bits >> 6 & 63];
        result += map2[bits & 63];
      }
      bits = (bits << 8) + object[idx];
    }
    tail = max % 3;
    if (tail === 0) {
      result += map2[bits >> 18 & 63];
      result += map2[bits >> 12 & 63];
      result += map2[bits >> 6 & 63];
      result += map2[bits & 63];
    } else if (tail === 2) {
      result += map2[bits >> 10 & 63];
      result += map2[bits >> 4 & 63];
      result += map2[bits << 2 & 63];
      result += map2[64];
    } else if (tail === 1) {
      result += map2[bits >> 2 & 63];
      result += map2[bits << 4 & 63];
      result += map2[64];
      result += map2[64];
    }
    return result;
  }
  __name(representYamlBinary, "representYamlBinary");
  function isBinary(obj) {
    return Object.prototype.toString.call(obj) === "[object Uint8Array]";
  }
  __name(isBinary, "isBinary");
  var binary = new type("tag:yaml.org,2002:binary", {
    kind: "scalar",
    resolve: resolveYamlBinary,
    construct: constructYamlBinary,
    predicate: isBinary,
    represent: representYamlBinary
  });
  var _hasOwnProperty$3 = Object.prototype.hasOwnProperty;
  var _toString$2 = Object.prototype.toString;
  function resolveYamlOmap(data) {
    if (data === null)
      return true;
    var objectKeys = [], index, length, pair, pairKey, pairHasKey, object = data;
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      pairHasKey = false;
      if (_toString$2.call(pair) !== "[object Object]")
        return false;
      for (pairKey in pair) {
        if (_hasOwnProperty$3.call(pair, pairKey)) {
          if (!pairHasKey)
            pairHasKey = true;
          else
            return false;
        }
      }
      if (!pairHasKey)
        return false;
      if (objectKeys.indexOf(pairKey) === -1)
        objectKeys.push(pairKey);
      else
        return false;
    }
    return true;
  }
  __name(resolveYamlOmap, "resolveYamlOmap");
  function constructYamlOmap(data) {
    return data !== null ? data : [];
  }
  __name(constructYamlOmap, "constructYamlOmap");
  var omap = new type("tag:yaml.org,2002:omap", {
    kind: "sequence",
    resolve: resolveYamlOmap,
    construct: constructYamlOmap
  });
  var _toString$1 = Object.prototype.toString;
  function resolveYamlPairs(data) {
    if (data === null)
      return true;
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      if (_toString$1.call(pair) !== "[object Object]")
        return false;
      keys = Object.keys(pair);
      if (keys.length !== 1)
        return false;
      result[index] = [keys[0], pair[keys[0]]];
    }
    return true;
  }
  __name(resolveYamlPairs, "resolveYamlPairs");
  function constructYamlPairs(data) {
    if (data === null)
      return [];
    var index, length, pair, keys, result, object = data;
    result = new Array(object.length);
    for (index = 0, length = object.length; index < length; index += 1) {
      pair = object[index];
      keys = Object.keys(pair);
      result[index] = [keys[0], pair[keys[0]]];
    }
    return result;
  }
  __name(constructYamlPairs, "constructYamlPairs");
  var pairs = new type("tag:yaml.org,2002:pairs", {
    kind: "sequence",
    resolve: resolveYamlPairs,
    construct: constructYamlPairs
  });
  var _hasOwnProperty$2 = Object.prototype.hasOwnProperty;
  function resolveYamlSet(data) {
    if (data === null)
      return true;
    var key, object = data;
    for (key in object) {
      if (_hasOwnProperty$2.call(object, key)) {
        if (object[key] !== null)
          return false;
      }
    }
    return true;
  }
  __name(resolveYamlSet, "resolveYamlSet");
  function constructYamlSet(data) {
    return data !== null ? data : {};
  }
  __name(constructYamlSet, "constructYamlSet");
  var set = new type("tag:yaml.org,2002:set", {
    kind: "mapping",
    resolve: resolveYamlSet,
    construct: constructYamlSet
  });
  var _default = core.extend({
    implicit: [
      timestamp,
      merge
    ],
    explicit: [
      binary,
      omap,
      pairs,
      set
    ]
  });
  var _hasOwnProperty$1 = Object.prototype.hasOwnProperty;
  var CONTEXT_FLOW_IN = 1;
  var CONTEXT_FLOW_OUT = 2;
  var CONTEXT_BLOCK_IN = 3;
  var CONTEXT_BLOCK_OUT = 4;
  var CHOMPING_CLIP = 1;
  var CHOMPING_STRIP = 2;
  var CHOMPING_KEEP = 3;
  var PATTERN_NON_PRINTABLE = /[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x84\x86-\x9F\uFFFE\uFFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
  var PATTERN_NON_ASCII_LINE_BREAKS = /[\x85\u2028\u2029]/;
  var PATTERN_FLOW_INDICATORS = /[,\[\]\{\}]/;
  var PATTERN_TAG_HANDLE = /^(?:!|!!|![a-z\-]+!)$/i;
  var PATTERN_TAG_URI = /^(?:!|[^,\[\]\{\}])(?:%[0-9a-f]{2}|[0-9a-z\-#;\/\?:@&=\+\$,_\.!~\*'\(\)\[\]])*$/i;
  function _class(obj) {
    return Object.prototype.toString.call(obj);
  }
  __name(_class, "_class");
  function is_EOL(c) {
    return c === 10 || c === 13;
  }
  __name(is_EOL, "is_EOL");
  function is_WHITE_SPACE(c) {
    return c === 9 || c === 32;
  }
  __name(is_WHITE_SPACE, "is_WHITE_SPACE");
  function is_WS_OR_EOL(c) {
    return c === 9 || c === 32 || c === 10 || c === 13;
  }
  __name(is_WS_OR_EOL, "is_WS_OR_EOL");
  function is_FLOW_INDICATOR(c) {
    return c === 44 || c === 91 || c === 93 || c === 123 || c === 125;
  }
  __name(is_FLOW_INDICATOR, "is_FLOW_INDICATOR");
  function fromHexCode(c) {
    var lc;
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    lc = c | 32;
    if (97 <= lc && lc <= 102) {
      return lc - 97 + 10;
    }
    return -1;
  }
  __name(fromHexCode, "fromHexCode");
  function escapedHexLen(c) {
    if (c === 120) {
      return 2;
    }
    if (c === 117) {
      return 4;
    }
    if (c === 85) {
      return 8;
    }
    return 0;
  }
  __name(escapedHexLen, "escapedHexLen");
  function fromDecimalCode(c) {
    if (48 <= c && c <= 57) {
      return c - 48;
    }
    return -1;
  }
  __name(fromDecimalCode, "fromDecimalCode");
  function simpleEscapeSequence(c) {
    return c === 48 ? "\0" : c === 97 ? "\x07" : c === 98 ? "\b" : c === 116 ? "	" : c === 9 ? "	" : c === 110 ? "\n" : c === 118 ? "\v" : c === 102 ? "\f" : c === 114 ? "\r" : c === 101 ? "\x1B" : c === 32 ? " " : c === 34 ? '"' : c === 47 ? "/" : c === 92 ? "\\" : c === 78 ? "\x85" : c === 95 ? "\xA0" : c === 76 ? "\u2028" : c === 80 ? "\u2029" : "";
  }
  __name(simpleEscapeSequence, "simpleEscapeSequence");
  function charFromCodepoint(c) {
    if (c <= 65535) {
      return String.fromCharCode(c);
    }
    return String.fromCharCode(
      (c - 65536 >> 10) + 55296,
      (c - 65536 & 1023) + 56320
    );
  }
  __name(charFromCodepoint, "charFromCodepoint");
  var simpleEscapeCheck = new Array(256);
  var simpleEscapeMap = new Array(256);
  for (i = 0; i < 256; i++) {
    simpleEscapeCheck[i] = simpleEscapeSequence(i) ? 1 : 0;
    simpleEscapeMap[i] = simpleEscapeSequence(i);
  }
  var i;
  function State$1(input, options) {
    this.input = input;
    this.filename = options["filename"] || null;
    this.schema = options["schema"] || _default;
    this.onWarning = options["onWarning"] || null;
    this.legacy = options["legacy"] || false;
    this.json = options["json"] || false;
    this.listener = options["listener"] || null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.typeMap = this.schema.compiledTypeMap;
    this.length = input.length;
    this.position = 0;
    this.line = 0;
    this.lineStart = 0;
    this.lineIndent = 0;
    this.firstTabInLine = -1;
    this.documents = [];
  }
  __name(State$1, "State$1");
  function generateError(state, message) {
    var mark = {
      name: state.filename,
      buffer: state.input.slice(0, -1),
      // omit trailing \0
      position: state.position,
      line: state.line,
      column: state.position - state.lineStart
    };
    mark.snippet = snippet(mark);
    return new exception(message, mark);
  }
  __name(generateError, "generateError");
  function throwError(state, message) {
    throw generateError(state, message);
  }
  __name(throwError, "throwError");
  function throwWarning(state, message) {
    if (state.onWarning) {
      state.onWarning.call(null, generateError(state, message));
    }
  }
  __name(throwWarning, "throwWarning");
  var directiveHandlers = {
    YAML: /* @__PURE__ */ __name(function handleYamlDirective(state, name, args) {
      var match, major, minor;
      if (state.version !== null) {
        throwError(state, "duplication of %YAML directive");
      }
      if (args.length !== 1) {
        throwError(state, "YAML directive accepts exactly one argument");
      }
      match = /^([0-9]+)\.([0-9]+)$/.exec(args[0]);
      if (match === null) {
        throwError(state, "ill-formed argument of the YAML directive");
      }
      major = parseInt(match[1], 10);
      minor = parseInt(match[2], 10);
      if (major !== 1) {
        throwError(state, "unacceptable YAML version of the document");
      }
      state.version = args[0];
      state.checkLineBreaks = minor < 2;
      if (minor !== 1 && minor !== 2) {
        throwWarning(state, "unsupported YAML version of the document");
      }
    }, "handleYamlDirective"),
    TAG: /* @__PURE__ */ __name(function handleTagDirective(state, name, args) {
      var handle, prefix;
      if (args.length !== 2) {
        throwError(state, "TAG directive accepts exactly two arguments");
      }
      handle = args[0];
      prefix = args[1];
      if (!PATTERN_TAG_HANDLE.test(handle)) {
        throwError(state, "ill-formed tag handle (first argument) of the TAG directive");
      }
      if (_hasOwnProperty$1.call(state.tagMap, handle)) {
        throwError(state, 'there is a previously declared suffix for "' + handle + '" tag handle');
      }
      if (!PATTERN_TAG_URI.test(prefix)) {
        throwError(state, "ill-formed tag prefix (second argument) of the TAG directive");
      }
      try {
        prefix = decodeURIComponent(prefix);
      } catch (err) {
        throwError(state, "tag prefix is malformed: " + prefix);
      }
      state.tagMap[handle] = prefix;
    }, "handleTagDirective")
  };
  function captureSegment(state, start, end, checkJson) {
    var _position, _length, _character, _result;
    if (start < end) {
      _result = state.input.slice(start, end);
      if (checkJson) {
        for (_position = 0, _length = _result.length; _position < _length; _position += 1) {
          _character = _result.charCodeAt(_position);
          if (!(_character === 9 || 32 <= _character && _character <= 1114111)) {
            throwError(state, "expected valid JSON character");
          }
        }
      } else if (PATTERN_NON_PRINTABLE.test(_result)) {
        throwError(state, "the stream contains non-printable characters");
      }
      state.result += _result;
    }
  }
  __name(captureSegment, "captureSegment");
  function mergeMappings(state, destination, source, overridableKeys) {
    var sourceKeys, key, index, quantity;
    if (!common.isObject(source)) {
      throwError(state, "cannot merge mappings; the provided source object is unacceptable");
    }
    sourceKeys = Object.keys(source);
    for (index = 0, quantity = sourceKeys.length; index < quantity; index += 1) {
      key = sourceKeys[index];
      if (!_hasOwnProperty$1.call(destination, key)) {
        destination[key] = source[key];
        overridableKeys[key] = true;
      }
    }
  }
  __name(mergeMappings, "mergeMappings");
  function storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, startLine, startLineStart, startPos) {
    var index, quantity;
    if (Array.isArray(keyNode)) {
      keyNode = Array.prototype.slice.call(keyNode);
      for (index = 0, quantity = keyNode.length; index < quantity; index += 1) {
        if (Array.isArray(keyNode[index])) {
          throwError(state, "nested arrays are not supported inside keys");
        }
        if (typeof keyNode === "object" && _class(keyNode[index]) === "[object Object]") {
          keyNode[index] = "[object Object]";
        }
      }
    }
    if (typeof keyNode === "object" && _class(keyNode) === "[object Object]") {
      keyNode = "[object Object]";
    }
    keyNode = String(keyNode);
    if (_result === null) {
      _result = {};
    }
    if (keyTag === "tag:yaml.org,2002:merge") {
      if (Array.isArray(valueNode)) {
        for (index = 0, quantity = valueNode.length; index < quantity; index += 1) {
          mergeMappings(state, _result, valueNode[index], overridableKeys);
        }
      } else {
        mergeMappings(state, _result, valueNode, overridableKeys);
      }
    } else {
      if (!state.json && !_hasOwnProperty$1.call(overridableKeys, keyNode) && _hasOwnProperty$1.call(_result, keyNode)) {
        state.line = startLine || state.line;
        state.lineStart = startLineStart || state.lineStart;
        state.position = startPos || state.position;
        throwError(state, "duplicated mapping key");
      }
      if (keyNode === "__proto__") {
        Object.defineProperty(_result, keyNode, {
          configurable: true,
          enumerable: true,
          writable: true,
          value: valueNode
        });
      } else {
        _result[keyNode] = valueNode;
      }
      delete overridableKeys[keyNode];
    }
    return _result;
  }
  __name(storeMappingPair, "storeMappingPair");
  function readLineBreak(state) {
    var ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 10) {
      state.position++;
    } else if (ch === 13) {
      state.position++;
      if (state.input.charCodeAt(state.position) === 10) {
        state.position++;
      }
    } else {
      throwError(state, "a line break is expected");
    }
    state.line += 1;
    state.lineStart = state.position;
    state.firstTabInLine = -1;
  }
  __name(readLineBreak, "readLineBreak");
  function skipSeparationSpace(state, allowComments, checkIndent) {
    var lineBreaks = 0, ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      while (is_WHITE_SPACE(ch)) {
        if (ch === 9 && state.firstTabInLine === -1) {
          state.firstTabInLine = state.position;
        }
        ch = state.input.charCodeAt(++state.position);
      }
      if (allowComments && ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (ch !== 10 && ch !== 13 && ch !== 0);
      }
      if (is_EOL(ch)) {
        readLineBreak(state);
        ch = state.input.charCodeAt(state.position);
        lineBreaks++;
        state.lineIndent = 0;
        while (ch === 32) {
          state.lineIndent++;
          ch = state.input.charCodeAt(++state.position);
        }
      } else {
        break;
      }
    }
    if (checkIndent !== -1 && lineBreaks !== 0 && state.lineIndent < checkIndent) {
      throwWarning(state, "deficient indentation");
    }
    return lineBreaks;
  }
  __name(skipSeparationSpace, "skipSeparationSpace");
  function testDocumentSeparator(state) {
    var _position = state.position, ch;
    ch = state.input.charCodeAt(_position);
    if ((ch === 45 || ch === 46) && ch === state.input.charCodeAt(_position + 1) && ch === state.input.charCodeAt(_position + 2)) {
      _position += 3;
      ch = state.input.charCodeAt(_position);
      if (ch === 0 || is_WS_OR_EOL(ch)) {
        return true;
      }
    }
    return false;
  }
  __name(testDocumentSeparator, "testDocumentSeparator");
  function writeFoldedLines(state, count) {
    if (count === 1) {
      state.result += " ";
    } else if (count > 1) {
      state.result += common.repeat("\n", count - 1);
    }
  }
  __name(writeFoldedLines, "writeFoldedLines");
  function readPlainScalar(state, nodeIndent, withinFlowCollection) {
    var preceding, following, captureStart, captureEnd, hasPendingContent, _line, _lineStart, _lineIndent, _kind = state.kind, _result = state.result, ch;
    ch = state.input.charCodeAt(state.position);
    if (is_WS_OR_EOL(ch) || is_FLOW_INDICATOR(ch) || ch === 35 || ch === 38 || ch === 42 || ch === 33 || ch === 124 || ch === 62 || ch === 39 || ch === 34 || ch === 37 || ch === 64 || ch === 96) {
      return false;
    }
    if (ch === 63 || ch === 45) {
      following = state.input.charCodeAt(state.position + 1);
      if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
        return false;
      }
    }
    state.kind = "scalar";
    state.result = "";
    captureStart = captureEnd = state.position;
    hasPendingContent = false;
    while (ch !== 0) {
      if (ch === 58) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following) || withinFlowCollection && is_FLOW_INDICATOR(following)) {
          break;
        }
      } else if (ch === 35) {
        preceding = state.input.charCodeAt(state.position - 1);
        if (is_WS_OR_EOL(preceding)) {
          break;
        }
      } else if (state.position === state.lineStart && testDocumentSeparator(state) || withinFlowCollection && is_FLOW_INDICATOR(ch)) {
        break;
      } else if (is_EOL(ch)) {
        _line = state.line;
        _lineStart = state.lineStart;
        _lineIndent = state.lineIndent;
        skipSeparationSpace(state, false, -1);
        if (state.lineIndent >= nodeIndent) {
          hasPendingContent = true;
          ch = state.input.charCodeAt(state.position);
          continue;
        } else {
          state.position = captureEnd;
          state.line = _line;
          state.lineStart = _lineStart;
          state.lineIndent = _lineIndent;
          break;
        }
      }
      if (hasPendingContent) {
        captureSegment(state, captureStart, captureEnd, false);
        writeFoldedLines(state, state.line - _line);
        captureStart = captureEnd = state.position;
        hasPendingContent = false;
      }
      if (!is_WHITE_SPACE(ch)) {
        captureEnd = state.position + 1;
      }
      ch = state.input.charCodeAt(++state.position);
    }
    captureSegment(state, captureStart, captureEnd, false);
    if (state.result) {
      return true;
    }
    state.kind = _kind;
    state.result = _result;
    return false;
  }
  __name(readPlainScalar, "readPlainScalar");
  function readSingleQuotedScalar(state, nodeIndent) {
    var ch, captureStart, captureEnd;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 39) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 39) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (ch === 39) {
          captureStart = state.position;
          state.position++;
          captureEnd = state.position;
        } else {
          return true;
        }
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a single quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a single quoted scalar");
  }
  __name(readSingleQuotedScalar, "readSingleQuotedScalar");
  function readDoubleQuotedScalar(state, nodeIndent) {
    var captureStart, captureEnd, hexLength, hexResult, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 34) {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    state.position++;
    captureStart = captureEnd = state.position;
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      if (ch === 34) {
        captureSegment(state, captureStart, state.position, true);
        state.position++;
        return true;
      } else if (ch === 92) {
        captureSegment(state, captureStart, state.position, true);
        ch = state.input.charCodeAt(++state.position);
        if (is_EOL(ch)) {
          skipSeparationSpace(state, false, nodeIndent);
        } else if (ch < 256 && simpleEscapeCheck[ch]) {
          state.result += simpleEscapeMap[ch];
          state.position++;
        } else if ((tmp = escapedHexLen(ch)) > 0) {
          hexLength = tmp;
          hexResult = 0;
          for (; hexLength > 0; hexLength--) {
            ch = state.input.charCodeAt(++state.position);
            if ((tmp = fromHexCode(ch)) >= 0) {
              hexResult = (hexResult << 4) + tmp;
            } else {
              throwError(state, "expected hexadecimal character");
            }
          }
          state.result += charFromCodepoint(hexResult);
          state.position++;
        } else {
          throwError(state, "unknown escape sequence");
        }
        captureStart = captureEnd = state.position;
      } else if (is_EOL(ch)) {
        captureSegment(state, captureStart, captureEnd, true);
        writeFoldedLines(state, skipSeparationSpace(state, false, nodeIndent));
        captureStart = captureEnd = state.position;
      } else if (state.position === state.lineStart && testDocumentSeparator(state)) {
        throwError(state, "unexpected end of the document within a double quoted scalar");
      } else {
        state.position++;
        captureEnd = state.position;
      }
    }
    throwError(state, "unexpected end of the stream within a double quoted scalar");
  }
  __name(readDoubleQuotedScalar, "readDoubleQuotedScalar");
  function readFlowCollection(state, nodeIndent) {
    var readNext = true, _line, _lineStart, _pos, _tag = state.tag, _result, _anchor = state.anchor, following, terminator, isPair, isExplicitPair, isMapping, overridableKeys = /* @__PURE__ */ Object.create(null), keyNode, keyTag, valueNode, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 91) {
      terminator = 93;
      isMapping = false;
      _result = [];
    } else if (ch === 123) {
      terminator = 125;
      isMapping = true;
      _result = {};
    } else {
      return false;
    }
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(++state.position);
    while (ch !== 0) {
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === terminator) {
        state.position++;
        state.tag = _tag;
        state.anchor = _anchor;
        state.kind = isMapping ? "mapping" : "sequence";
        state.result = _result;
        return true;
      } else if (!readNext) {
        throwError(state, "missed comma between flow collection entries");
      } else if (ch === 44) {
        throwError(state, "expected the node content, but found ','");
      }
      keyTag = keyNode = valueNode = null;
      isPair = isExplicitPair = false;
      if (ch === 63) {
        following = state.input.charCodeAt(state.position + 1);
        if (is_WS_OR_EOL(following)) {
          isPair = isExplicitPair = true;
          state.position++;
          skipSeparationSpace(state, true, nodeIndent);
        }
      }
      _line = state.line;
      _lineStart = state.lineStart;
      _pos = state.position;
      composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
      keyTag = state.tag;
      keyNode = state.result;
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if ((isExplicitPair || state.line === _line) && ch === 58) {
        isPair = true;
        ch = state.input.charCodeAt(++state.position);
        skipSeparationSpace(state, true, nodeIndent);
        composeNode(state, nodeIndent, CONTEXT_FLOW_IN, false, true);
        valueNode = state.result;
      }
      if (isMapping) {
        storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos);
      } else if (isPair) {
        _result.push(storeMappingPair(state, null, overridableKeys, keyTag, keyNode, valueNode, _line, _lineStart, _pos));
      } else {
        _result.push(keyNode);
      }
      skipSeparationSpace(state, true, nodeIndent);
      ch = state.input.charCodeAt(state.position);
      if (ch === 44) {
        readNext = true;
        ch = state.input.charCodeAt(++state.position);
      } else {
        readNext = false;
      }
    }
    throwError(state, "unexpected end of the stream within a flow collection");
  }
  __name(readFlowCollection, "readFlowCollection");
  function readBlockScalar(state, nodeIndent) {
    var captureStart, folding, chomping = CHOMPING_CLIP, didReadContent = false, detectedIndent = false, textIndent = nodeIndent, emptyLines = 0, atMoreIndented = false, tmp, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch === 124) {
      folding = false;
    } else if (ch === 62) {
      folding = true;
    } else {
      return false;
    }
    state.kind = "scalar";
    state.result = "";
    while (ch !== 0) {
      ch = state.input.charCodeAt(++state.position);
      if (ch === 43 || ch === 45) {
        if (CHOMPING_CLIP === chomping) {
          chomping = ch === 43 ? CHOMPING_KEEP : CHOMPING_STRIP;
        } else {
          throwError(state, "repeat of a chomping mode identifier");
        }
      } else if ((tmp = fromDecimalCode(ch)) >= 0) {
        if (tmp === 0) {
          throwError(state, "bad explicit indentation width of a block scalar; it cannot be less than one");
        } else if (!detectedIndent) {
          textIndent = nodeIndent + tmp - 1;
          detectedIndent = true;
        } else {
          throwError(state, "repeat of an indentation width identifier");
        }
      } else {
        break;
      }
    }
    if (is_WHITE_SPACE(ch)) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (is_WHITE_SPACE(ch));
      if (ch === 35) {
        do {
          ch = state.input.charCodeAt(++state.position);
        } while (!is_EOL(ch) && ch !== 0);
      }
    }
    while (ch !== 0) {
      readLineBreak(state);
      state.lineIndent = 0;
      ch = state.input.charCodeAt(state.position);
      while ((!detectedIndent || state.lineIndent < textIndent) && ch === 32) {
        state.lineIndent++;
        ch = state.input.charCodeAt(++state.position);
      }
      if (!detectedIndent && state.lineIndent > textIndent) {
        textIndent = state.lineIndent;
      }
      if (is_EOL(ch)) {
        emptyLines++;
        continue;
      }
      if (state.lineIndent < textIndent) {
        if (chomping === CHOMPING_KEEP) {
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (chomping === CHOMPING_CLIP) {
          if (didReadContent) {
            state.result += "\n";
          }
        }
        break;
      }
      if (folding) {
        if (is_WHITE_SPACE(ch)) {
          atMoreIndented = true;
          state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
        } else if (atMoreIndented) {
          atMoreIndented = false;
          state.result += common.repeat("\n", emptyLines + 1);
        } else if (emptyLines === 0) {
          if (didReadContent) {
            state.result += " ";
          }
        } else {
          state.result += common.repeat("\n", emptyLines);
        }
      } else {
        state.result += common.repeat("\n", didReadContent ? 1 + emptyLines : emptyLines);
      }
      didReadContent = true;
      detectedIndent = true;
      emptyLines = 0;
      captureStart = state.position;
      while (!is_EOL(ch) && ch !== 0) {
        ch = state.input.charCodeAt(++state.position);
      }
      captureSegment(state, captureStart, state.position, false);
    }
    return true;
  }
  __name(readBlockScalar, "readBlockScalar");
  function readBlockSequence(state, nodeIndent) {
    var _line, _tag = state.tag, _anchor = state.anchor, _result = [], following, detected = false, ch;
    if (state.firstTabInLine !== -1)
      return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      if (ch !== 45) {
        break;
      }
      following = state.input.charCodeAt(state.position + 1);
      if (!is_WS_OR_EOL(following)) {
        break;
      }
      detected = true;
      state.position++;
      if (skipSeparationSpace(state, true, -1)) {
        if (state.lineIndent <= nodeIndent) {
          _result.push(null);
          ch = state.input.charCodeAt(state.position);
          continue;
        }
      }
      _line = state.line;
      composeNode(state, nodeIndent, CONTEXT_BLOCK_IN, false, true);
      _result.push(state.result);
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a sequence entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "sequence";
      state.result = _result;
      return true;
    }
    return false;
  }
  __name(readBlockSequence, "readBlockSequence");
  function readBlockMapping(state, nodeIndent, flowIndent) {
    var following, allowCompact, _line, _keyLine, _keyLineStart, _keyPos, _tag = state.tag, _anchor = state.anchor, _result = {}, overridableKeys = /* @__PURE__ */ Object.create(null), keyTag = null, keyNode = null, valueNode = null, atExplicitKey = false, detected = false, ch;
    if (state.firstTabInLine !== -1)
      return false;
    if (state.anchor !== null) {
      state.anchorMap[state.anchor] = _result;
    }
    ch = state.input.charCodeAt(state.position);
    while (ch !== 0) {
      if (!atExplicitKey && state.firstTabInLine !== -1) {
        state.position = state.firstTabInLine;
        throwError(state, "tab characters must not be used in indentation");
      }
      following = state.input.charCodeAt(state.position + 1);
      _line = state.line;
      if ((ch === 63 || ch === 58) && is_WS_OR_EOL(following)) {
        if (ch === 63) {
          if (atExplicitKey) {
            storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
            keyTag = keyNode = valueNode = null;
          }
          detected = true;
          atExplicitKey = true;
          allowCompact = true;
        } else if (atExplicitKey) {
          atExplicitKey = false;
          allowCompact = true;
        } else {
          throwError(state, "incomplete explicit mapping pair; a key node is missed; or followed by a non-tabulated empty line");
        }
        state.position += 1;
        ch = following;
      } else {
        _keyLine = state.line;
        _keyLineStart = state.lineStart;
        _keyPos = state.position;
        if (!composeNode(state, flowIndent, CONTEXT_FLOW_OUT, false, true)) {
          break;
        }
        if (state.line === _line) {
          ch = state.input.charCodeAt(state.position);
          while (is_WHITE_SPACE(ch)) {
            ch = state.input.charCodeAt(++state.position);
          }
          if (ch === 58) {
            ch = state.input.charCodeAt(++state.position);
            if (!is_WS_OR_EOL(ch)) {
              throwError(state, "a whitespace character is expected after the key-value separator within a block mapping");
            }
            if (atExplicitKey) {
              storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
              keyTag = keyNode = valueNode = null;
            }
            detected = true;
            atExplicitKey = false;
            allowCompact = false;
            keyTag = state.tag;
            keyNode = state.result;
          } else if (detected) {
            throwError(state, "can not read an implicit mapping pair; a colon is missed");
          } else {
            state.tag = _tag;
            state.anchor = _anchor;
            return true;
          }
        } else if (detected) {
          throwError(state, "can not read a block mapping entry; a multiline key may not be an implicit key");
        } else {
          state.tag = _tag;
          state.anchor = _anchor;
          return true;
        }
      }
      if (state.line === _line || state.lineIndent > nodeIndent) {
        if (atExplicitKey) {
          _keyLine = state.line;
          _keyLineStart = state.lineStart;
          _keyPos = state.position;
        }
        if (composeNode(state, nodeIndent, CONTEXT_BLOCK_OUT, true, allowCompact)) {
          if (atExplicitKey) {
            keyNode = state.result;
          } else {
            valueNode = state.result;
          }
        }
        if (!atExplicitKey) {
          storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, valueNode, _keyLine, _keyLineStart, _keyPos);
          keyTag = keyNode = valueNode = null;
        }
        skipSeparationSpace(state, true, -1);
        ch = state.input.charCodeAt(state.position);
      }
      if ((state.line === _line || state.lineIndent > nodeIndent) && ch !== 0) {
        throwError(state, "bad indentation of a mapping entry");
      } else if (state.lineIndent < nodeIndent) {
        break;
      }
    }
    if (atExplicitKey) {
      storeMappingPair(state, _result, overridableKeys, keyTag, keyNode, null, _keyLine, _keyLineStart, _keyPos);
    }
    if (detected) {
      state.tag = _tag;
      state.anchor = _anchor;
      state.kind = "mapping";
      state.result = _result;
    }
    return detected;
  }
  __name(readBlockMapping, "readBlockMapping");
  function readTagProperty(state) {
    var _position, isVerbatim = false, isNamed = false, tagHandle, tagName, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 33)
      return false;
    if (state.tag !== null) {
      throwError(state, "duplication of a tag property");
    }
    ch = state.input.charCodeAt(++state.position);
    if (ch === 60) {
      isVerbatim = true;
      ch = state.input.charCodeAt(++state.position);
    } else if (ch === 33) {
      isNamed = true;
      tagHandle = "!!";
      ch = state.input.charCodeAt(++state.position);
    } else {
      tagHandle = "!";
    }
    _position = state.position;
    if (isVerbatim) {
      do {
        ch = state.input.charCodeAt(++state.position);
      } while (ch !== 0 && ch !== 62);
      if (state.position < state.length) {
        tagName = state.input.slice(_position, state.position);
        ch = state.input.charCodeAt(++state.position);
      } else {
        throwError(state, "unexpected end of the stream within a verbatim tag");
      }
    } else {
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        if (ch === 33) {
          if (!isNamed) {
            tagHandle = state.input.slice(_position - 1, state.position + 1);
            if (!PATTERN_TAG_HANDLE.test(tagHandle)) {
              throwError(state, "named tag handle cannot contain such characters");
            }
            isNamed = true;
            _position = state.position + 1;
          } else {
            throwError(state, "tag suffix cannot contain exclamation marks");
          }
        }
        ch = state.input.charCodeAt(++state.position);
      }
      tagName = state.input.slice(_position, state.position);
      if (PATTERN_FLOW_INDICATORS.test(tagName)) {
        throwError(state, "tag suffix cannot contain flow indicator characters");
      }
    }
    if (tagName && !PATTERN_TAG_URI.test(tagName)) {
      throwError(state, "tag name cannot contain such characters: " + tagName);
    }
    try {
      tagName = decodeURIComponent(tagName);
    } catch (err) {
      throwError(state, "tag name is malformed: " + tagName);
    }
    if (isVerbatim) {
      state.tag = tagName;
    } else if (_hasOwnProperty$1.call(state.tagMap, tagHandle)) {
      state.tag = state.tagMap[tagHandle] + tagName;
    } else if (tagHandle === "!") {
      state.tag = "!" + tagName;
    } else if (tagHandle === "!!") {
      state.tag = "tag:yaml.org,2002:" + tagName;
    } else {
      throwError(state, 'undeclared tag handle "' + tagHandle + '"');
    }
    return true;
  }
  __name(readTagProperty, "readTagProperty");
  function readAnchorProperty(state) {
    var _position, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 38)
      return false;
    if (state.anchor !== null) {
      throwError(state, "duplication of an anchor property");
    }
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an anchor node must contain at least one character");
    }
    state.anchor = state.input.slice(_position, state.position);
    return true;
  }
  __name(readAnchorProperty, "readAnchorProperty");
  function readAlias(state) {
    var _position, alias, ch;
    ch = state.input.charCodeAt(state.position);
    if (ch !== 42)
      return false;
    ch = state.input.charCodeAt(++state.position);
    _position = state.position;
    while (ch !== 0 && !is_WS_OR_EOL(ch) && !is_FLOW_INDICATOR(ch)) {
      ch = state.input.charCodeAt(++state.position);
    }
    if (state.position === _position) {
      throwError(state, "name of an alias node must contain at least one character");
    }
    alias = state.input.slice(_position, state.position);
    if (!_hasOwnProperty$1.call(state.anchorMap, alias)) {
      throwError(state, 'unidentified alias "' + alias + '"');
    }
    state.result = state.anchorMap[alias];
    skipSeparationSpace(state, true, -1);
    return true;
  }
  __name(readAlias, "readAlias");
  function composeNode(state, parentIndent, nodeContext, allowToSeek, allowCompact) {
    var allowBlockStyles, allowBlockScalars, allowBlockCollections, indentStatus = 1, atNewLine = false, hasContent = false, typeIndex, typeQuantity, typeList, type2, flowIndent, blockIndent;
    if (state.listener !== null) {
      state.listener("open", state);
    }
    state.tag = null;
    state.anchor = null;
    state.kind = null;
    state.result = null;
    allowBlockStyles = allowBlockScalars = allowBlockCollections = CONTEXT_BLOCK_OUT === nodeContext || CONTEXT_BLOCK_IN === nodeContext;
    if (allowToSeek) {
      if (skipSeparationSpace(state, true, -1)) {
        atNewLine = true;
        if (state.lineIndent > parentIndent) {
          indentStatus = 1;
        } else if (state.lineIndent === parentIndent) {
          indentStatus = 0;
        } else if (state.lineIndent < parentIndent) {
          indentStatus = -1;
        }
      }
    }
    if (indentStatus === 1) {
      while (readTagProperty(state) || readAnchorProperty(state)) {
        if (skipSeparationSpace(state, true, -1)) {
          atNewLine = true;
          allowBlockCollections = allowBlockStyles;
          if (state.lineIndent > parentIndent) {
            indentStatus = 1;
          } else if (state.lineIndent === parentIndent) {
            indentStatus = 0;
          } else if (state.lineIndent < parentIndent) {
            indentStatus = -1;
          }
        } else {
          allowBlockCollections = false;
        }
      }
    }
    if (allowBlockCollections) {
      allowBlockCollections = atNewLine || allowCompact;
    }
    if (indentStatus === 1 || CONTEXT_BLOCK_OUT === nodeContext) {
      if (CONTEXT_FLOW_IN === nodeContext || CONTEXT_FLOW_OUT === nodeContext) {
        flowIndent = parentIndent;
      } else {
        flowIndent = parentIndent + 1;
      }
      blockIndent = state.position - state.lineStart;
      if (indentStatus === 1) {
        if (allowBlockCollections && (readBlockSequence(state, blockIndent) || readBlockMapping(state, blockIndent, flowIndent)) || readFlowCollection(state, flowIndent)) {
          hasContent = true;
        } else {
          if (allowBlockScalars && readBlockScalar(state, flowIndent) || readSingleQuotedScalar(state, flowIndent) || readDoubleQuotedScalar(state, flowIndent)) {
            hasContent = true;
          } else if (readAlias(state)) {
            hasContent = true;
            if (state.tag !== null || state.anchor !== null) {
              throwError(state, "alias node should not have any properties");
            }
          } else if (readPlainScalar(state, flowIndent, CONTEXT_FLOW_IN === nodeContext)) {
            hasContent = true;
            if (state.tag === null) {
              state.tag = "?";
            }
          }
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
        }
      } else if (indentStatus === 0) {
        hasContent = allowBlockCollections && readBlockSequence(state, blockIndent);
      }
    }
    if (state.tag === null) {
      if (state.anchor !== null) {
        state.anchorMap[state.anchor] = state.result;
      }
    } else if (state.tag === "?") {
      if (state.result !== null && state.kind !== "scalar") {
        throwError(state, 'unacceptable node kind for !<?> tag; it should be "scalar", not "' + state.kind + '"');
      }
      for (typeIndex = 0, typeQuantity = state.implicitTypes.length; typeIndex < typeQuantity; typeIndex += 1) {
        type2 = state.implicitTypes[typeIndex];
        if (type2.resolve(state.result)) {
          state.result = type2.construct(state.result);
          state.tag = type2.tag;
          if (state.anchor !== null) {
            state.anchorMap[state.anchor] = state.result;
          }
          break;
        }
      }
    } else if (state.tag !== "!") {
      if (_hasOwnProperty$1.call(state.typeMap[state.kind || "fallback"], state.tag)) {
        type2 = state.typeMap[state.kind || "fallback"][state.tag];
      } else {
        type2 = null;
        typeList = state.typeMap.multi[state.kind || "fallback"];
        for (typeIndex = 0, typeQuantity = typeList.length; typeIndex < typeQuantity; typeIndex += 1) {
          if (state.tag.slice(0, typeList[typeIndex].tag.length) === typeList[typeIndex].tag) {
            type2 = typeList[typeIndex];
            break;
          }
        }
      }
      if (!type2) {
        throwError(state, "unknown tag !<" + state.tag + ">");
      }
      if (state.result !== null && type2.kind !== state.kind) {
        throwError(state, "unacceptable node kind for !<" + state.tag + '> tag; it should be "' + type2.kind + '", not "' + state.kind + '"');
      }
      if (!type2.resolve(state.result, state.tag)) {
        throwError(state, "cannot resolve a node with !<" + state.tag + "> explicit tag");
      } else {
        state.result = type2.construct(state.result, state.tag);
        if (state.anchor !== null) {
          state.anchorMap[state.anchor] = state.result;
        }
      }
    }
    if (state.listener !== null) {
      state.listener("close", state);
    }
    return state.tag !== null || state.anchor !== null || hasContent;
  }
  __name(composeNode, "composeNode");
  function readDocument(state) {
    var documentStart = state.position, _position, directiveName, directiveArgs, hasDirectives = false, ch;
    state.version = null;
    state.checkLineBreaks = state.legacy;
    state.tagMap = /* @__PURE__ */ Object.create(null);
    state.anchorMap = /* @__PURE__ */ Object.create(null);
    while ((ch = state.input.charCodeAt(state.position)) !== 0) {
      skipSeparationSpace(state, true, -1);
      ch = state.input.charCodeAt(state.position);
      if (state.lineIndent > 0 || ch !== 37) {
        break;
      }
      hasDirectives = true;
      ch = state.input.charCodeAt(++state.position);
      _position = state.position;
      while (ch !== 0 && !is_WS_OR_EOL(ch)) {
        ch = state.input.charCodeAt(++state.position);
      }
      directiveName = state.input.slice(_position, state.position);
      directiveArgs = [];
      if (directiveName.length < 1) {
        throwError(state, "directive name must not be less than one character in length");
      }
      while (ch !== 0) {
        while (is_WHITE_SPACE(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        if (ch === 35) {
          do {
            ch = state.input.charCodeAt(++state.position);
          } while (ch !== 0 && !is_EOL(ch));
          break;
        }
        if (is_EOL(ch))
          break;
        _position = state.position;
        while (ch !== 0 && !is_WS_OR_EOL(ch)) {
          ch = state.input.charCodeAt(++state.position);
        }
        directiveArgs.push(state.input.slice(_position, state.position));
      }
      if (ch !== 0)
        readLineBreak(state);
      if (_hasOwnProperty$1.call(directiveHandlers, directiveName)) {
        directiveHandlers[directiveName](state, directiveName, directiveArgs);
      } else {
        throwWarning(state, 'unknown document directive "' + directiveName + '"');
      }
    }
    skipSeparationSpace(state, true, -1);
    if (state.lineIndent === 0 && state.input.charCodeAt(state.position) === 45 && state.input.charCodeAt(state.position + 1) === 45 && state.input.charCodeAt(state.position + 2) === 45) {
      state.position += 3;
      skipSeparationSpace(state, true, -1);
    } else if (hasDirectives) {
      throwError(state, "directives end mark is expected");
    }
    composeNode(state, state.lineIndent - 1, CONTEXT_BLOCK_OUT, false, true);
    skipSeparationSpace(state, true, -1);
    if (state.checkLineBreaks && PATTERN_NON_ASCII_LINE_BREAKS.test(state.input.slice(documentStart, state.position))) {
      throwWarning(state, "non-ASCII line breaks are interpreted as content");
    }
    state.documents.push(state.result);
    if (state.position === state.lineStart && testDocumentSeparator(state)) {
      if (state.input.charCodeAt(state.position) === 46) {
        state.position += 3;
        skipSeparationSpace(state, true, -1);
      }
      return;
    }
    if (state.position < state.length - 1) {
      throwError(state, "end of the stream or a document separator is expected");
    } else {
      return;
    }
  }
  __name(readDocument, "readDocument");
  function loadDocuments(input, options) {
    input = String(input);
    options = options || {};
    if (input.length !== 0) {
      if (input.charCodeAt(input.length - 1) !== 10 && input.charCodeAt(input.length - 1) !== 13) {
        input += "\n";
      }
      if (input.charCodeAt(0) === 65279) {
        input = input.slice(1);
      }
    }
    var state = new State$1(input, options);
    var nullpos = input.indexOf("\0");
    if (nullpos !== -1) {
      state.position = nullpos;
      throwError(state, "null byte is not allowed in input");
    }
    state.input += "\0";
    while (state.input.charCodeAt(state.position) === 32) {
      state.lineIndent += 1;
      state.position += 1;
    }
    while (state.position < state.length - 1) {
      readDocument(state);
    }
    return state.documents;
  }
  __name(loadDocuments, "loadDocuments");
  function loadAll$1(input, iterator, options) {
    if (iterator !== null && typeof iterator === "object" && typeof options === "undefined") {
      options = iterator;
      iterator = null;
    }
    var documents = loadDocuments(input, options);
    if (typeof iterator !== "function") {
      return documents;
    }
    for (var index = 0, length = documents.length; index < length; index += 1) {
      iterator(documents[index]);
    }
  }
  __name(loadAll$1, "loadAll$1");
  function load$1(input, options) {
    var documents = loadDocuments(input, options);
    if (documents.length === 0) {
      return void 0;
    } else if (documents.length === 1) {
      return documents[0];
    }
    throw new exception("expected a single document in the stream, but found more");
  }
  __name(load$1, "load$1");
  var loadAll_1 = loadAll$1;
  var load_1 = load$1;
  var loader = {
    loadAll: loadAll_1,
    load: load_1
  };
  var _toString = Object.prototype.toString;
  var _hasOwnProperty = Object.prototype.hasOwnProperty;
  var CHAR_BOM = 65279;
  var CHAR_TAB = 9;
  var CHAR_LINE_FEED = 10;
  var CHAR_CARRIAGE_RETURN = 13;
  var CHAR_SPACE = 32;
  var CHAR_EXCLAMATION = 33;
  var CHAR_DOUBLE_QUOTE = 34;
  var CHAR_SHARP = 35;
  var CHAR_PERCENT = 37;
  var CHAR_AMPERSAND = 38;
  var CHAR_SINGLE_QUOTE = 39;
  var CHAR_ASTERISK = 42;
  var CHAR_COMMA = 44;
  var CHAR_MINUS = 45;
  var CHAR_COLON = 58;
  var CHAR_EQUALS = 61;
  var CHAR_GREATER_THAN = 62;
  var CHAR_QUESTION = 63;
  var CHAR_COMMERCIAL_AT = 64;
  var CHAR_LEFT_SQUARE_BRACKET = 91;
  var CHAR_RIGHT_SQUARE_BRACKET = 93;
  var CHAR_GRAVE_ACCENT = 96;
  var CHAR_LEFT_CURLY_BRACKET = 123;
  var CHAR_VERTICAL_LINE = 124;
  var CHAR_RIGHT_CURLY_BRACKET = 125;
  var ESCAPE_SEQUENCES = {};
  ESCAPE_SEQUENCES[0] = "\\0";
  ESCAPE_SEQUENCES[7] = "\\a";
  ESCAPE_SEQUENCES[8] = "\\b";
  ESCAPE_SEQUENCES[9] = "\\t";
  ESCAPE_SEQUENCES[10] = "\\n";
  ESCAPE_SEQUENCES[11] = "\\v";
  ESCAPE_SEQUENCES[12] = "\\f";
  ESCAPE_SEQUENCES[13] = "\\r";
  ESCAPE_SEQUENCES[27] = "\\e";
  ESCAPE_SEQUENCES[34] = '\\"';
  ESCAPE_SEQUENCES[92] = "\\\\";
  ESCAPE_SEQUENCES[133] = "\\N";
  ESCAPE_SEQUENCES[160] = "\\_";
  ESCAPE_SEQUENCES[8232] = "\\L";
  ESCAPE_SEQUENCES[8233] = "\\P";
  var DEPRECATED_BOOLEANS_SYNTAX = [
    "y",
    "Y",
    "yes",
    "Yes",
    "YES",
    "on",
    "On",
    "ON",
    "n",
    "N",
    "no",
    "No",
    "NO",
    "off",
    "Off",
    "OFF"
  ];
  var DEPRECATED_BASE60_SYNTAX = /^[-+]?[0-9_]+(?::[0-9_]+)+(?:\.[0-9_]*)?$/;
  function compileStyleMap(schema2, map2) {
    var result, keys, index, length, tag, style, type2;
    if (map2 === null)
      return {};
    result = {};
    keys = Object.keys(map2);
    for (index = 0, length = keys.length; index < length; index += 1) {
      tag = keys[index];
      style = String(map2[tag]);
      if (tag.slice(0, 2) === "!!") {
        tag = "tag:yaml.org,2002:" + tag.slice(2);
      }
      type2 = schema2.compiledTypeMap["fallback"][tag];
      if (type2 && _hasOwnProperty.call(type2.styleAliases, style)) {
        style = type2.styleAliases[style];
      }
      result[tag] = style;
    }
    return result;
  }
  __name(compileStyleMap, "compileStyleMap");
  function encodeHex(character) {
    var string, handle, length;
    string = character.toString(16).toUpperCase();
    if (character <= 255) {
      handle = "x";
      length = 2;
    } else if (character <= 65535) {
      handle = "u";
      length = 4;
    } else if (character <= 4294967295) {
      handle = "U";
      length = 8;
    } else {
      throw new exception("code point within a string may not be greater than 0xFFFFFFFF");
    }
    return "\\" + handle + common.repeat("0", length - string.length) + string;
  }
  __name(encodeHex, "encodeHex");
  var QUOTING_TYPE_SINGLE = 1;
  var QUOTING_TYPE_DOUBLE = 2;
  function State(options) {
    this.schema = options["schema"] || _default;
    this.indent = Math.max(1, options["indent"] || 2);
    this.noArrayIndent = options["noArrayIndent"] || false;
    this.skipInvalid = options["skipInvalid"] || false;
    this.flowLevel = common.isNothing(options["flowLevel"]) ? -1 : options["flowLevel"];
    this.styleMap = compileStyleMap(this.schema, options["styles"] || null);
    this.sortKeys = options["sortKeys"] || false;
    this.lineWidth = options["lineWidth"] || 80;
    this.noRefs = options["noRefs"] || false;
    this.noCompatMode = options["noCompatMode"] || false;
    this.condenseFlow = options["condenseFlow"] || false;
    this.quotingType = options["quotingType"] === '"' ? QUOTING_TYPE_DOUBLE : QUOTING_TYPE_SINGLE;
    this.forceQuotes = options["forceQuotes"] || false;
    this.replacer = typeof options["replacer"] === "function" ? options["replacer"] : null;
    this.implicitTypes = this.schema.compiledImplicit;
    this.explicitTypes = this.schema.compiledExplicit;
    this.tag = null;
    this.result = "";
    this.duplicates = [];
    this.usedDuplicates = null;
  }
  __name(State, "State");
  function indentString(string, spaces) {
    var ind = common.repeat(" ", spaces), position = 0, next = -1, result = "", line, length = string.length;
    while (position < length) {
      next = string.indexOf("\n", position);
      if (next === -1) {
        line = string.slice(position);
        position = length;
      } else {
        line = string.slice(position, next + 1);
        position = next + 1;
      }
      if (line.length && line !== "\n")
        result += ind;
      result += line;
    }
    return result;
  }
  __name(indentString, "indentString");
  function generateNextLine(state, level) {
    return "\n" + common.repeat(" ", state.indent * level);
  }
  __name(generateNextLine, "generateNextLine");
  function testImplicitResolving(state, str2) {
    var index, length, type2;
    for (index = 0, length = state.implicitTypes.length; index < length; index += 1) {
      type2 = state.implicitTypes[index];
      if (type2.resolve(str2)) {
        return true;
      }
    }
    return false;
  }
  __name(testImplicitResolving, "testImplicitResolving");
  function isWhitespace(c) {
    return c === CHAR_SPACE || c === CHAR_TAB;
  }
  __name(isWhitespace, "isWhitespace");
  function isPrintable(c) {
    return 32 <= c && c <= 126 || 161 <= c && c <= 55295 && c !== 8232 && c !== 8233 || 57344 <= c && c <= 65533 && c !== CHAR_BOM || 65536 <= c && c <= 1114111;
  }
  __name(isPrintable, "isPrintable");
  function isNsCharOrWhitespace(c) {
    return isPrintable(c) && c !== CHAR_BOM && c !== CHAR_CARRIAGE_RETURN && c !== CHAR_LINE_FEED;
  }
  __name(isNsCharOrWhitespace, "isNsCharOrWhitespace");
  function isPlainSafe(c, prev, inblock) {
    var cIsNsCharOrWhitespace = isNsCharOrWhitespace(c);
    var cIsNsChar = cIsNsCharOrWhitespace && !isWhitespace(c);
    return (
      // ns-plain-safe
      (inblock ? (
        // c = flow-in
        cIsNsCharOrWhitespace
      ) : cIsNsCharOrWhitespace && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET) && c !== CHAR_SHARP && !(prev === CHAR_COLON && !cIsNsChar) || isNsCharOrWhitespace(prev) && !isWhitespace(prev) && c === CHAR_SHARP || prev === CHAR_COLON && cIsNsChar
    );
  }
  __name(isPlainSafe, "isPlainSafe");
  function isPlainSafeFirst(c) {
    return isPrintable(c) && c !== CHAR_BOM && !isWhitespace(c) && c !== CHAR_MINUS && c !== CHAR_QUESTION && c !== CHAR_COLON && c !== CHAR_COMMA && c !== CHAR_LEFT_SQUARE_BRACKET && c !== CHAR_RIGHT_SQUARE_BRACKET && c !== CHAR_LEFT_CURLY_BRACKET && c !== CHAR_RIGHT_CURLY_BRACKET && c !== CHAR_SHARP && c !== CHAR_AMPERSAND && c !== CHAR_ASTERISK && c !== CHAR_EXCLAMATION && c !== CHAR_VERTICAL_LINE && c !== CHAR_EQUALS && c !== CHAR_GREATER_THAN && c !== CHAR_SINGLE_QUOTE && c !== CHAR_DOUBLE_QUOTE && c !== CHAR_PERCENT && c !== CHAR_COMMERCIAL_AT && c !== CHAR_GRAVE_ACCENT;
  }
  __name(isPlainSafeFirst, "isPlainSafeFirst");
  function isPlainSafeLast(c) {
    return !isWhitespace(c) && c !== CHAR_COLON;
  }
  __name(isPlainSafeLast, "isPlainSafeLast");
  function codePointAt(string, pos) {
    var first = string.charCodeAt(pos), second;
    if (first >= 55296 && first <= 56319 && pos + 1 < string.length) {
      second = string.charCodeAt(pos + 1);
      if (second >= 56320 && second <= 57343) {
        return (first - 55296) * 1024 + second - 56320 + 65536;
      }
    }
    return first;
  }
  __name(codePointAt, "codePointAt");
  function needIndentIndicator(string) {
    var leadingSpaceRe = /^\n* /;
    return leadingSpaceRe.test(string);
  }
  __name(needIndentIndicator, "needIndentIndicator");
  var STYLE_PLAIN = 1;
  var STYLE_SINGLE = 2;
  var STYLE_LITERAL = 3;
  var STYLE_FOLDED = 4;
  var STYLE_DOUBLE = 5;
  function chooseScalarStyle(string, singleLineOnly, indentPerLevel, lineWidth, testAmbiguousType, quotingType, forceQuotes, inblock) {
    var i;
    var char = 0;
    var prevChar = null;
    var hasLineBreak = false;
    var hasFoldableLine = false;
    var shouldTrackWidth = lineWidth !== -1;
    var previousLineBreak = -1;
    var plain = isPlainSafeFirst(codePointAt(string, 0)) && isPlainSafeLast(codePointAt(string, string.length - 1));
    if (singleLineOnly || forceQuotes) {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
    } else {
      for (i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
        char = codePointAt(string, i);
        if (char === CHAR_LINE_FEED) {
          hasLineBreak = true;
          if (shouldTrackWidth) {
            hasFoldableLine = hasFoldableLine || // Foldable line = too long, and not more-indented.
            i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ";
            previousLineBreak = i;
          }
        } else if (!isPrintable(char)) {
          return STYLE_DOUBLE;
        }
        plain = plain && isPlainSafe(char, prevChar, inblock);
        prevChar = char;
      }
      hasFoldableLine = hasFoldableLine || shouldTrackWidth && (i - previousLineBreak - 1 > lineWidth && string[previousLineBreak + 1] !== " ");
    }
    if (!hasLineBreak && !hasFoldableLine) {
      if (plain && !forceQuotes && !testAmbiguousType(string)) {
        return STYLE_PLAIN;
      }
      return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
    }
    if (indentPerLevel > 9 && needIndentIndicator(string)) {
      return STYLE_DOUBLE;
    }
    if (!forceQuotes) {
      return hasFoldableLine ? STYLE_FOLDED : STYLE_LITERAL;
    }
    return quotingType === QUOTING_TYPE_DOUBLE ? STYLE_DOUBLE : STYLE_SINGLE;
  }
  __name(chooseScalarStyle, "chooseScalarStyle");
  function writeScalar(state, string, level, iskey, inblock) {
    state.dump = function() {
      if (string.length === 0) {
        return state.quotingType === QUOTING_TYPE_DOUBLE ? '""' : "''";
      }
      if (!state.noCompatMode) {
        if (DEPRECATED_BOOLEANS_SYNTAX.indexOf(string) !== -1 || DEPRECATED_BASE60_SYNTAX.test(string)) {
          return state.quotingType === QUOTING_TYPE_DOUBLE ? '"' + string + '"' : "'" + string + "'";
        }
      }
      var indent = state.indent * Math.max(1, level);
      var lineWidth = state.lineWidth === -1 ? -1 : Math.max(Math.min(state.lineWidth, 40), state.lineWidth - indent);
      var singleLineOnly = iskey || state.flowLevel > -1 && level >= state.flowLevel;
      function testAmbiguity(string2) {
        return testImplicitResolving(state, string2);
      }
      __name(testAmbiguity, "testAmbiguity");
      switch (chooseScalarStyle(
        string,
        singleLineOnly,
        state.indent,
        lineWidth,
        testAmbiguity,
        state.quotingType,
        state.forceQuotes && !iskey,
        inblock
      )) {
        case STYLE_PLAIN:
          return string;
        case STYLE_SINGLE:
          return "'" + string.replace(/'/g, "''") + "'";
        case STYLE_LITERAL:
          return "|" + blockHeader(string, state.indent) + dropEndingNewline(indentString(string, indent));
        case STYLE_FOLDED:
          return ">" + blockHeader(string, state.indent) + dropEndingNewline(indentString(foldString(string, lineWidth), indent));
        case STYLE_DOUBLE:
          return '"' + escapeString(string) + '"';
        default:
          throw new exception("impossible error: invalid scalar style");
      }
    }();
  }
  __name(writeScalar, "writeScalar");
  function blockHeader(string, indentPerLevel) {
    var indentIndicator = needIndentIndicator(string) ? String(indentPerLevel) : "";
    var clip = string[string.length - 1] === "\n";
    var keep = clip && (string[string.length - 2] === "\n" || string === "\n");
    var chomp = keep ? "+" : clip ? "" : "-";
    return indentIndicator + chomp + "\n";
  }
  __name(blockHeader, "blockHeader");
  function dropEndingNewline(string) {
    return string[string.length - 1] === "\n" ? string.slice(0, -1) : string;
  }
  __name(dropEndingNewline, "dropEndingNewline");
  function foldString(string, width) {
    var lineRe = /(\n+)([^\n]*)/g;
    var result = function() {
      var nextLF = string.indexOf("\n");
      nextLF = nextLF !== -1 ? nextLF : string.length;
      lineRe.lastIndex = nextLF;
      return foldLine(string.slice(0, nextLF), width);
    }();
    var prevMoreIndented = string[0] === "\n" || string[0] === " ";
    var moreIndented;
    var match;
    while (match = lineRe.exec(string)) {
      var prefix = match[1], line = match[2];
      moreIndented = line[0] === " ";
      result += prefix + (!prevMoreIndented && !moreIndented && line !== "" ? "\n" : "") + foldLine(line, width);
      prevMoreIndented = moreIndented;
    }
    return result;
  }
  __name(foldString, "foldString");
  function foldLine(line, width) {
    if (line === "" || line[0] === " ")
      return line;
    var breakRe = / [^ ]/g;
    var match;
    var start = 0, end, curr = 0, next = 0;
    var result = "";
    while (match = breakRe.exec(line)) {
      next = match.index;
      if (next - start > width) {
        end = curr > start ? curr : next;
        result += "\n" + line.slice(start, end);
        start = end + 1;
      }
      curr = next;
    }
    result += "\n";
    if (line.length - start > width && curr > start) {
      result += line.slice(start, curr) + "\n" + line.slice(curr + 1);
    } else {
      result += line.slice(start);
    }
    return result.slice(1);
  }
  __name(foldLine, "foldLine");
  function escapeString(string) {
    var result = "";
    var char = 0;
    var escapeSeq;
    for (var i = 0; i < string.length; char >= 65536 ? i += 2 : i++) {
      char = codePointAt(string, i);
      escapeSeq = ESCAPE_SEQUENCES[char];
      if (!escapeSeq && isPrintable(char)) {
        result += string[i];
        if (char >= 65536)
          result += string[i + 1];
      } else {
        result += escapeSeq || encodeHex(char);
      }
    }
    return result;
  }
  __name(escapeString, "escapeString");
  function writeFlowSequence(state, level, object) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level, value, false, false) || typeof value === "undefined" && writeNode(state, level, null, false, false)) {
        if (_result !== "")
          _result += "," + (!state.condenseFlow ? " " : "");
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = "[" + _result + "]";
  }
  __name(writeFlowSequence, "writeFlowSequence");
  function writeBlockSequence(state, level, object, compact) {
    var _result = "", _tag = state.tag, index, length, value;
    for (index = 0, length = object.length; index < length; index += 1) {
      value = object[index];
      if (state.replacer) {
        value = state.replacer.call(object, String(index), value);
      }
      if (writeNode(state, level + 1, value, true, true, false, true) || typeof value === "undefined" && writeNode(state, level + 1, null, true, true, false, true)) {
        if (!compact || _result !== "") {
          _result += generateNextLine(state, level);
        }
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          _result += "-";
        } else {
          _result += "- ";
        }
        _result += state.dump;
      }
    }
    state.tag = _tag;
    state.dump = _result || "[]";
  }
  __name(writeBlockSequence, "writeBlockSequence");
  function writeFlowMapping(state, level, object) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, pairBuffer;
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (_result !== "")
        pairBuffer += ", ";
      if (state.condenseFlow)
        pairBuffer += '"';
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level, objectKey, false, false)) {
        continue;
      }
      if (state.dump.length > 1024)
        pairBuffer += "? ";
      pairBuffer += state.dump + (state.condenseFlow ? '"' : "") + ":" + (state.condenseFlow ? "" : " ");
      if (!writeNode(state, level, objectValue, false, false)) {
        continue;
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = "{" + _result + "}";
  }
  __name(writeFlowMapping, "writeFlowMapping");
  function writeBlockMapping(state, level, object, compact) {
    var _result = "", _tag = state.tag, objectKeyList = Object.keys(object), index, length, objectKey, objectValue, explicitPair, pairBuffer;
    if (state.sortKeys === true) {
      objectKeyList.sort();
    } else if (typeof state.sortKeys === "function") {
      objectKeyList.sort(state.sortKeys);
    } else if (state.sortKeys) {
      throw new exception("sortKeys must be a boolean or a function");
    }
    for (index = 0, length = objectKeyList.length; index < length; index += 1) {
      pairBuffer = "";
      if (!compact || _result !== "") {
        pairBuffer += generateNextLine(state, level);
      }
      objectKey = objectKeyList[index];
      objectValue = object[objectKey];
      if (state.replacer) {
        objectValue = state.replacer.call(object, objectKey, objectValue);
      }
      if (!writeNode(state, level + 1, objectKey, true, true, true)) {
        continue;
      }
      explicitPair = state.tag !== null && state.tag !== "?" || state.dump && state.dump.length > 1024;
      if (explicitPair) {
        if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
          pairBuffer += "?";
        } else {
          pairBuffer += "? ";
        }
      }
      pairBuffer += state.dump;
      if (explicitPair) {
        pairBuffer += generateNextLine(state, level);
      }
      if (!writeNode(state, level + 1, objectValue, true, explicitPair)) {
        continue;
      }
      if (state.dump && CHAR_LINE_FEED === state.dump.charCodeAt(0)) {
        pairBuffer += ":";
      } else {
        pairBuffer += ": ";
      }
      pairBuffer += state.dump;
      _result += pairBuffer;
    }
    state.tag = _tag;
    state.dump = _result || "{}";
  }
  __name(writeBlockMapping, "writeBlockMapping");
  function detectType(state, object, explicit) {
    var _result, typeList, index, length, type2, style;
    typeList = explicit ? state.explicitTypes : state.implicitTypes;
    for (index = 0, length = typeList.length; index < length; index += 1) {
      type2 = typeList[index];
      if ((type2.instanceOf || type2.predicate) && (!type2.instanceOf || typeof object === "object" && object instanceof type2.instanceOf) && (!type2.predicate || type2.predicate(object))) {
        if (explicit) {
          if (type2.multi && type2.representName) {
            state.tag = type2.representName(object);
          } else {
            state.tag = type2.tag;
          }
        } else {
          state.tag = "?";
        }
        if (type2.represent) {
          style = state.styleMap[type2.tag] || type2.defaultStyle;
          if (_toString.call(type2.represent) === "[object Function]") {
            _result = type2.represent(object, style);
          } else if (_hasOwnProperty.call(type2.represent, style)) {
            _result = type2.represent[style](object, style);
          } else {
            throw new exception("!<" + type2.tag + '> tag resolver accepts not "' + style + '" style');
          }
          state.dump = _result;
        }
        return true;
      }
    }
    return false;
  }
  __name(detectType, "detectType");
  function writeNode(state, level, object, block, compact, iskey, isblockseq) {
    state.tag = null;
    state.dump = object;
    if (!detectType(state, object, false)) {
      detectType(state, object, true);
    }
    var type2 = _toString.call(state.dump);
    var inblock = block;
    var tagStr;
    if (block) {
      block = state.flowLevel < 0 || state.flowLevel > level;
    }
    var objectOrArray = type2 === "[object Object]" || type2 === "[object Array]", duplicateIndex, duplicate;
    if (objectOrArray) {
      duplicateIndex = state.duplicates.indexOf(object);
      duplicate = duplicateIndex !== -1;
    }
    if (state.tag !== null && state.tag !== "?" || duplicate || state.indent !== 2 && level > 0) {
      compact = false;
    }
    if (duplicate && state.usedDuplicates[duplicateIndex]) {
      state.dump = "*ref_" + duplicateIndex;
    } else {
      if (objectOrArray && duplicate && !state.usedDuplicates[duplicateIndex]) {
        state.usedDuplicates[duplicateIndex] = true;
      }
      if (type2 === "[object Object]") {
        if (block && Object.keys(state.dump).length !== 0) {
          writeBlockMapping(state, level, state.dump, compact);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowMapping(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object Array]") {
        if (block && state.dump.length !== 0) {
          if (state.noArrayIndent && !isblockseq && level > 0) {
            writeBlockSequence(state, level - 1, state.dump, compact);
          } else {
            writeBlockSequence(state, level, state.dump, compact);
          }
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + state.dump;
          }
        } else {
          writeFlowSequence(state, level, state.dump);
          if (duplicate) {
            state.dump = "&ref_" + duplicateIndex + " " + state.dump;
          }
        }
      } else if (type2 === "[object String]") {
        if (state.tag !== "?") {
          writeScalar(state, state.dump, level, iskey, inblock);
        }
      } else if (type2 === "[object Undefined]") {
        return false;
      } else {
        if (state.skipInvalid)
          return false;
        throw new exception("unacceptable kind of an object to dump " + type2);
      }
      if (state.tag !== null && state.tag !== "?") {
        tagStr = encodeURI(
          state.tag[0] === "!" ? state.tag.slice(1) : state.tag
        ).replace(/!/g, "%21");
        if (state.tag[0] === "!") {
          tagStr = "!" + tagStr;
        } else if (tagStr.slice(0, 18) === "tag:yaml.org,2002:") {
          tagStr = "!!" + tagStr.slice(18);
        } else {
          tagStr = "!<" + tagStr + ">";
        }
        state.dump = tagStr + " " + state.dump;
      }
    }
    return true;
  }
  __name(writeNode, "writeNode");
  function getDuplicateReferences(object, state) {
    var objects = [], duplicatesIndexes = [], index, length;
    inspectNode(object, objects, duplicatesIndexes);
    for (index = 0, length = duplicatesIndexes.length; index < length; index += 1) {
      state.duplicates.push(objects[duplicatesIndexes[index]]);
    }
    state.usedDuplicates = new Array(length);
  }
  __name(getDuplicateReferences, "getDuplicateReferences");
  function inspectNode(object, objects, duplicatesIndexes) {
    var objectKeyList, index, length;
    if (object !== null && typeof object === "object") {
      index = objects.indexOf(object);
      if (index !== -1) {
        if (duplicatesIndexes.indexOf(index) === -1) {
          duplicatesIndexes.push(index);
        }
      } else {
        objects.push(object);
        if (Array.isArray(object)) {
          for (index = 0, length = object.length; index < length; index += 1) {
            inspectNode(object[index], objects, duplicatesIndexes);
          }
        } else {
          objectKeyList = Object.keys(object);
          for (index = 0, length = objectKeyList.length; index < length; index += 1) {
            inspectNode(object[objectKeyList[index]], objects, duplicatesIndexes);
          }
        }
      }
    }
  }
  __name(inspectNode, "inspectNode");
  function dump$1(input, options) {
    options = options || {};
    var state = new State(options);
    if (!state.noRefs)
      getDuplicateReferences(input, state);
    var value = input;
    if (state.replacer) {
      value = state.replacer.call({ "": value }, "", value);
    }
    if (writeNode(state, 0, value, true, true))
      return state.dump + "\n";
    return "";
  }
  __name(dump$1, "dump$1");
  var dump_1 = dump$1;
  var dumper = {
    dump: dump_1
  };
  function renamed(from, to) {
    return function() {
      throw new Error("Function yaml." + from + " is removed in js-yaml 4. Use yaml." + to + " instead, which is now safe by default.");
    };
  }
  __name(renamed, "renamed");
  var Type = type;
  var Schema = schema;
  var FAILSAFE_SCHEMA = failsafe;
  var JSON_SCHEMA = json;
  var CORE_SCHEMA = core;
  var DEFAULT_SCHEMA = _default;
  var load = loader.load;
  var loadAll = loader.loadAll;
  var dump = dumper.dump;
  var YAMLException = exception;
  var types = {
    binary,
    float,
    map,
    null: _null,
    pairs,
    set,
    timestamp,
    bool,
    int,
    merge,
    omap,
    seq,
    str
  };
  var safeLoad = renamed("safeLoad", "load");
  var safeLoadAll = renamed("safeLoadAll", "loadAll");
  var safeDump = renamed("safeDump", "dump");
  var jsYaml = {
    Type,
    Schema,
    FAILSAFE_SCHEMA,
    JSON_SCHEMA,
    CORE_SCHEMA,
    DEFAULT_SCHEMA,
    load,
    loadAll,
    dump,
    YAMLException,
    types,
    safeLoad,
    safeLoadAll,
    safeDump
  };
  var js_yaml_default = jsYaml;

  // src/ClashConfigBuilder.js
  var ClashConfigBuilder = class extends BaseConfigBuilder {
    constructor(inputString, selectedRules, customRules, baseConfig, lang, userAgent) {
      if (!baseConfig) {
        baseConfig = CLASH_CONFIG;
      }
      super(inputString, baseConfig, lang, userAgent);
      this.selectedRules = selectedRules;
      this.customRules = customRules;
    }
    getProxies() {
      return this.config.proxies || [];
    }
    getProxyName(proxy) {
      return proxy.name;
    }
    convertProxy(proxy) {
      switch (proxy.type) {
        case "shadowsocks":
          return {
            name: proxy.tag,
            type: "ss",
            server: proxy.server,
            port: proxy.server_port,
            cipher: proxy.method,
            password: proxy.password
          };
        case "vmess":
          return {
            name: proxy.tag,
            type: proxy.type,
            server: proxy.server,
            port: proxy.server_port,
            uuid: proxy.uuid,
            alterId: proxy.alter_id,
            cipher: proxy.security,
            tls: proxy.tls?.enabled || false,
            servername: proxy.tls?.server_name || "",
            network: proxy.transport?.type || "tcp",
            "ws-opts": proxy.transport?.type === "ws" ? {
              path: proxy.transport.path,
              headers: proxy.transport.headers
            } : void 0
          };
        case "vless":
          return {
            name: proxy.tag,
            type: proxy.type,
            server: proxy.server,
            port: proxy.server_port,
            uuid: proxy.uuid,
            cipher: proxy.security,
            tls: proxy.tls?.enabled || false,
            "client-fingerprint": proxy.tls.utls?.fingerprint,
            servername: proxy.tls?.server_name || "",
            network: proxy.transport?.type || "tcp",
            "ws-opts": proxy.transport?.type === "ws" ? {
              path: proxy.transport.path,
              headers: proxy.transport.headers
            } : void 0,
            "reality-opts": proxy.tls.reality?.enabled ? {
              "public-key": proxy.tls.reality.public_key,
              "short-id": proxy.tls.reality.short_id
            } : void 0,
            "grpc-opts": proxy.transport?.type === "grpc" ? {
              "grpc-service-name": proxy.transport.service_name
            } : void 0,
            tfo: proxy.tcp_fast_open,
            "skip-cert-verify": proxy.tls.insecure,
            "flow": proxy.flow ?? void 0
          };
        case "hysteria2":
          return {
            name: proxy.tag,
            type: proxy.type,
            server: proxy.server,
            port: proxy.server_port,
            obfs: proxy.obfs.type,
            "obfs-password": proxy.obfs.password,
            password: proxy.password,
            auth: proxy.auth,
            up: proxy.up_mbps,
            down: proxy.down_mbps,
            "recv-window-conn": proxy.recv_window_conn,
            sni: proxy.tls?.server_name || "",
            "skip-cert-verify": proxy.tls?.insecure || true
          };
        case "trojan":
          return {
            name: proxy.tag,
            type: proxy.type,
            server: proxy.server,
            port: proxy.server_port,
            password: proxy.password,
            cipher: proxy.security,
            tls: proxy.tls?.enabled || false,
            "client-fingerprint": proxy.tls.utls?.fingerprint,
            sni: proxy.tls?.server_name || "",
            network: proxy.transport?.type || "tcp",
            "ws-opts": proxy.transport?.type === "ws" ? {
              path: proxy.transport.path,
              headers: proxy.transport.headers
            } : void 0,
            "reality-opts": proxy.tls.reality?.enabled ? {
              "public-key": proxy.tls.reality.public_key,
              "short-id": proxy.tls.reality.short_id
            } : void 0,
            "grpc-opts": proxy.transport?.type === "grpc" ? {
              "grpc-service-name": proxy.transport.service_name
            } : void 0,
            tfo: proxy.tcp_fast_open,
            "skip-cert-verify": proxy.tls.insecure,
            "flow": proxy.flow ?? void 0
          };
        case "tuic":
          return {
            name: proxy.tag,
            type: proxy.type,
            server: proxy.server,
            port: proxy.server_port,
            uuid: proxy.uuid,
            password: proxy.password,
            "congestion-controller": proxy.congestion,
            "skip-cert-verify": proxy.tls.insecure,
            "disable-sni": true,
            "alpn": proxy.tls.alpn,
            "sni": proxy.tls.server_name,
            "udp-relay-mode": "native"
          };
        default:
          return proxy;
      }
    }
    addProxyToConfig(proxy) {
      this.config.proxies = this.config.proxies || [];
      const similarProxies = this.config.proxies.filter((p) => p.name.includes(proxy.name));
      const isIdentical = similarProxies.some((p) => {
        const { name: _, ...restOfProxy } = proxy;
        const { name: __, ...restOfP } = p;
        return JSON.stringify(restOfProxy) === JSON.stringify(restOfP);
      });
      if (isIdentical) {
        return;
      }
      if (similarProxies.length > 0) {
        proxy.name = `${proxy.name} ${similarProxies.length + 1}`;
      }
      this.config.proxies.push(proxy);
    }
    addAutoSelectGroup(proxyList) {
      this.config["proxy-groups"] = this.config["proxy-groups"] || [];
      this.config["proxy-groups"].push({
        name: t("outboundNames.Auto Select"),
        type: "url-test",
        proxies: DeepCopy(proxyList),
        url: "https://www.gstatic.com/generate_204",
        interval: 300,
        lazy: false
      });
    }
    addNodeSelectGroup(proxyList) {
      proxyList.unshift("DIRECT", "REJECT", t("outboundNames.Auto Select"));
      this.config["proxy-groups"].unshift({
        type: "select",
        name: t("outboundNames.Node Select"),
        proxies: proxyList
      });
    }
    addOutboundGroups(outbounds, proxyList) {
      outbounds.forEach((outbound) => {
        if (outbound !== t("outboundNames.Node Select")) {
          this.config["proxy-groups"].push({
            type: "select",
            name: t(`outboundNames.${outbound}`),
            proxies: [t("outboundNames.Node Select"), ...proxyList]
          });
        }
      });
    }
    addCustomRuleGroups(proxyList) {
      if (Array.isArray(this.customRules)) {
        this.customRules.forEach((rule) => {
          this.config["proxy-groups"].push({
            type: "select",
            name: t(`outboundNames.${rule.name}`),
            proxies: [t("outboundNames.Node Select"), ...proxyList]
          });
        });
      }
    }
    addFallBackGroup(proxyList) {
      this.config["proxy-groups"].push({
        type: "select",
        name: t("outboundNames.Fall Back"),
        proxies: [t("outboundNames.Node Select"), ...proxyList]
      });
    }
    // 生成规则
    generateRules() {
      return generateRules(this.selectedRules, this.customRules);
    }
    formatConfig() {
      const rules = this.generateRules();
      const ruleResults = [];
      const { site_rule_providers, ip_rule_providers } = generateClashRuleSets(this.selectedRules, this.customRules);
      this.config["rule-providers"] = {
        ...site_rule_providers,
        ...ip_rule_providers
      };
      rules.filter((rule) => !!rule.domain_suffix || !!rule.domain_keyword).map((rule) => {
        rule.domain_suffix.forEach((suffix) => {
          ruleResults.push(`DOMAIN-SUFFIX,${suffix},${t("outboundNames." + rule.outbound)}`);
        });
        rule.domain_keyword.forEach((keyword) => {
          ruleResults.push(`DOMAIN-KEYWORD,${keyword},${t("outboundNames." + rule.outbound)}`);
        });
      });
      rules.filter((rule) => !!rule.site_rules[0]).map((rule) => {
        rule.site_rules.forEach((site) => {
          ruleResults.push(`RULE-SET,${site},${t("outboundNames." + rule.outbound)}`);
        });
      });
      rules.filter((rule) => !!rule.ip_rules[0]).map((rule) => {
        rule.ip_rules.forEach((ip) => {
          ruleResults.push(`RULE-SET,${ip},${t("outboundNames." + rule.outbound)},no-resolve`);
        });
      });
      rules.filter((rule) => !!rule.ip_cidr).map((rule) => {
        rule.ip_cidr.forEach((cidr) => {
          ruleResults.push(`IP-CIDR,${cidr},${t("outboundNames." + rule.outbound)},no-resolve`);
        });
      });
      this.config.rules = [...ruleResults];
      this.config.rules.push(`MATCH,${t("outboundNames.Fall Back")}`);
      return js_yaml_default.dump(this.config);
    }
  };
  __name(ClashConfigBuilder, "ClashConfigBuilder");

  // src/SurgeConfigBuilder.js
  var SurgeConfigBuilder = class extends BaseConfigBuilder {
    constructor(inputString, selectedRules, customRules, baseConfig, lang, userAgent) {
      baseConfig = SURGE_CONFIG;
      super(inputString, baseConfig, lang, userAgent);
      this.selectedRules = selectedRules;
      this.customRules = customRules;
      this.subscriptionUrl = null;
    }
    setSubscriptionUrl(url) {
      this.subscriptionUrl = url;
      return this;
    }
    getProxies() {
      return this.config.proxies || [];
    }
    getProxyName(proxy) {
      return proxy.split("=")[0].trim();
    }
    convertProxy(proxy) {
      let surgeProxy;
      switch (proxy.type) {
        case "shadowsocks":
          surgeProxy = `${proxy.tag} = ss, ${proxy.server}, ${proxy.server_port}, encrypt-method=${proxy.method}, password=${proxy.password}`;
          break;
        case "vmess":
          surgeProxy = `${proxy.tag} = vmess, ${proxy.server}, ${proxy.server_port}, username=${proxy.uuid}`;
          if (proxy.alter_id == 0) {
            surgeProxy += ", vmess-aead=true";
          }
          if (proxy.tls?.enabled) {
            surgeProxy += ", tls=true";
            if (proxy.tls.server_name) {
              surgeProxy += `, sni=${proxy.tls.server_name}`;
            }
            if (proxy.tls.insecure) {
              surgeProxy += ", skip-cert-verify=true";
            }
            if (proxy.tls.alpn) {
              surgeProxy += `, alpn=${proxy.tls.alpn.join(",")}`;
            }
          }
          if (proxy.transport?.type === "ws") {
            surgeProxy += `, ws=true, ws-path=${proxy.transport.path}`;
            if (proxy.transport.headers) {
              surgeProxy += `, ws-headers=Host:${proxy.transport.headers.Host}`;
            }
          } else if (proxy.transport?.type === "grpc") {
            surgeProxy += `, grpc-service-name=${proxy.transport.service_name}`;
          }
          break;
        case "trojan":
          surgeProxy = `${proxy.tag} = trojan, ${proxy.server}, ${proxy.server_port}, password=${proxy.password}`;
          if (proxy.tls?.server_name) {
            surgeProxy += `, sni=${proxy.tls.server_name}`;
          }
          if (proxy.tls?.insecure) {
            surgeProxy += ", skip-cert-verify=true";
          }
          if (proxy.tls?.alpn) {
            surgeProxy += `, alpn=${proxy.tls.alpn.join(",")}`;
          }
          if (proxy.transport?.type === "ws") {
            surgeProxy += `, ws=true, ws-path=${proxy.transport.path}`;
            if (proxy.transport.headers) {
              surgeProxy += `, ws-headers=Host:${proxy.transport.headers.Host}`;
            }
          } else if (proxy.transport?.type === "grpc") {
            surgeProxy += `, grpc-service-name=${proxy.transport.service_name}`;
          }
          break;
        case "hysteria2":
          surgeProxy = `${proxy.tag} = hysteria2, ${proxy.server}, ${proxy.server_port}, password=${proxy.password}`;
          if (proxy.tls?.server_name) {
            surgeProxy += `, sni=${proxy.tls.server_name}`;
          }
          if (proxy.tls?.insecure) {
            surgeProxy += ", skip-cert-verify=true";
          }
          if (proxy.tls?.alpn) {
            surgeProxy += `, alpn=${proxy.tls.alpn.join(",")}`;
          }
          break;
        case "tuic":
          surgeProxy = `${proxy.tag} = tuic, ${proxy.server}, ${proxy.server_port}, password=${proxy.password}, uuid=${proxy.uuid}`;
          if (proxy.tls?.server_name) {
            surgeProxy += `, sni=${proxy.tls.server_name}`;
          }
          if (proxy.tls?.alpn) {
            surgeProxy += `, alpn=${proxy.tls.alpn.join(",")}`;
          }
          if (proxy.tls?.insecure) {
            surgeProxy += ", skip-cert-verify=true";
          }
          if (proxy.congestion_control) {
            surgeProxy += `, congestion-controller=${proxy.congestion_control}`;
          }
          if (proxy.udp_relay_mode) {
            surgeProxy += `, udp-relay-mode=${proxy.udp_relay_mode}`;
          }
          break;
        default:
          surgeProxy = `# ${proxy.tag} - Unsupported proxy type: ${proxy.type}`;
      }
      return surgeProxy;
    }
    addProxyToConfig(proxy) {
      this.config.proxies = this.config.proxies || [];
      const proxyName = this.getProxyName(proxy);
      const similarProxies = this.config.proxies.map((p) => this.getProxyName(p)).filter((name) => name.includes(proxyName));
      const isIdentical = this.config.proxies.some(
        (p) => (
          // Compare the remaining configuration after removing the name part
          p.substring(p.indexOf("=")) === proxy.substring(proxy.indexOf("="))
        )
      );
      if (isIdentical) {
        return;
      }
      if (similarProxies.length > 0) {
        const equalsPos = proxy.indexOf("=");
        if (equalsPos > 0) {
          proxy = `${proxyName} ${similarProxies.length + 1}${proxy.substring(equalsPos)}`;
        }
      }
      this.config.proxies.push(proxy);
    }
    createProxyGroup(name, type2, options = [], extraConfig = "") {
      const baseOptions = type2 === "url-test" ? [] : ["DIRECT", "REJECT-DROP"];
      const proxyNames = this.getProxies().map((proxy) => this.getProxyName(proxy));
      const allOptions = [...baseOptions, ...options, ...proxyNames];
      return `${name} = ${type2}, ${allOptions.join(", ")}${extraConfig}`;
    }
    addAutoSelectGroup(proxyList) {
      this.config["proxy-groups"] = this.config["proxy-groups"] || [];
      this.config["proxy-groups"].push(
        this.createProxyGroup(t("outboundNames.Auto Select"), "url-test", [], ", url=http://www.gstatic.com/generate_204, interval=300")
      );
    }
    addNodeSelectGroup(proxyList) {
      this.config["proxy-groups"].push(
        this.createProxyGroup(t("outboundNames.Node Select"), "select", [t("outboundNames.Auto Select")])
      );
    }
    addOutboundGroups(outbounds, proxyList) {
      outbounds.forEach((outbound) => {
        if (outbound !== t("outboundNames.Node Select")) {
          this.config["proxy-groups"].push(
            this.createProxyGroup(t(`outboundNames.${outbound}`), "select", [t("outboundNames.Node Select")])
          );
        }
      });
    }
    addCustomRuleGroups(proxyList) {
      if (Array.isArray(this.customRules)) {
        this.customRules.forEach((rule) => {
          this.config["proxy-groups"].push(
            this.createProxyGroup(rule.name, "select", [t("outboundNames.Node Select")])
          );
        });
      }
    }
    addFallBackGroup(proxyList) {
      this.config["proxy-groups"].push(
        this.createProxyGroup(t("outboundNames.Fall Back"), "select", [t("outboundNames.Node Select")])
      );
    }
    formatConfig() {
      const rules = generateRules(this.selectedRules, this.customRules);
      let finalConfig = [];
      if (this.subscriptionUrl) {
        finalConfig.push(`#!MANAGED-CONFIG ${this.subscriptionUrl} interval=43200 strict=false`);
        finalConfig.push("");
      }
      finalConfig.push("[General]");
      if (this.config.general) {
        Object.entries(this.config.general).forEach(([key, value]) => {
          finalConfig.push(`${key} = ${value}`);
        });
      }
      if (this.config.replica) {
        finalConfig.push("\n[Replica]");
        Object.entries(this.config.replica).forEach(([key, value]) => {
          finalConfig.push(`${key} = ${value}`);
        });
      }
      finalConfig.push("\n[Proxy]");
      finalConfig.push("DIRECT = direct");
      if (this.config.proxies) {
        finalConfig.push(...this.config.proxies);
      }
      finalConfig.push("\n[Proxy Group]");
      if (this.config["proxy-groups"]) {
        finalConfig.push(...this.config["proxy-groups"]);
      }
      finalConfig.push("\n[Rule]");
      rules.filter((rule) => !!rule.domain_suffix).map((rule) => {
        rule.domain_suffix.forEach((suffix) => {
          finalConfig.push(`DOMAIN-SUFFIX,${suffix},${t("outboundNames." + rule.outbound)}`);
        });
      });
      rules.filter((rule) => !!rule.domain_keyword).map((rule) => {
        rule.domain_keyword.forEach((keyword) => {
          finalConfig.push(`DOMAIN-KEYWORD,${keyword},${t("outboundNames." + rule.outbound)}`);
        });
      });
      rules.filter((rule) => rule.site_rules[0] !== "").map((rule) => {
        rule.site_rules.forEach((site) => {
          finalConfig.push(`RULE-SET,${SURGE_SITE_RULE_SET_BASEURL}${site}.conf,${t("outboundNames." + rule.outbound)}`);
        });
      });
      rules.filter((rule) => rule.ip_rules[0] !== "").map((rule) => {
        rule.ip_rules.forEach((ip) => {
          finalConfig.push(`RULE-SET,${SURGE_IP_RULE_SET_BASEURL}${ip}.txt,${t("outboundNames." + rule.outbound)},no-resolve`);
        });
      });
      rules.filter((rule) => !!rule.ip_cidr).map((rule) => {
        rule.ip_cidr.forEach((cidr) => {
          finalConfig.push(`IP-CIDR,${cidr},${t("outboundNames." + rule.outbound)},no-resolve`);
        });
      });
      finalConfig.push("FINAL," + t("outboundNames.Fall Back"));
      return finalConfig.join("\n");
    }
    getCurrentUrl() {
      try {
        if (typeof self !== "undefined" && self.location) {
          return self.location.href;
        }
        return null;
      } catch (error) {
        console.error("Error getting current URL:", error);
        return null;
      }
    }
  };
  __name(SurgeConfigBuilder, "SurgeConfigBuilder");

  // src/index.js
  addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
  });
  async function handleRequest(request) {
    try {
      const url = new URL(request.url);
      const lang = url.searchParams.get("lang");
      setLanguage(lang || request.headers.get("accept-language")?.split(",")[0]);
      if (request.method === "GET" && url.pathname === "/") {
        return new Response(generateHtml("", "", "", "", url.origin), {
          headers: { "Content-Type": "text/html" }
        });
      } else if (url.pathname.startsWith("/singbox") || url.pathname.startsWith("/clash") || url.pathname.startsWith("/surge")) {
        const inputString = url.searchParams.get("config");
        let selectedRules = url.searchParams.get("selectedRules");
        let customRules = url.searchParams.get("customRules");
        let lang2 = url.searchParams.get("lang") || "zh-CN";
        let userAgent = url.searchParams.get("ua");
        if (!userAgent) {
          userAgent = "curl/7.74.0";
        }
        if (!inputString) {
          return new Response(t("missingConfig"), { status: 400 });
        }
        if (PREDEFINED_RULE_SETS[selectedRules]) {
          selectedRules = PREDEFINED_RULE_SETS[selectedRules];
        } else {
          try {
            selectedRules = JSON.parse(decodeURIComponent(selectedRules));
          } catch (error) {
            console.error("Error parsing selectedRules:", error);
            selectedRules = PREDEFINED_RULE_SETS.minimal;
          }
        }
        try {
          customRules = JSON.parse(decodeURIComponent(customRules));
        } catch (error) {
          console.error("Error parsing customRules:", error);
          customRules = [];
        }
        const configId = url.searchParams.get("configId");
        let baseConfig;
        if (configId) {
          const customConfig = await SUBLINK_KV.get(configId);
          if (customConfig) {
            baseConfig = JSON.parse(customConfig);
          }
        }
        let configBuilder;
        if (url.pathname.startsWith("/singbox")) {
          configBuilder = new SingboxConfigBuilder(inputString, selectedRules, customRules, baseConfig, lang2, userAgent);
        } else if (url.pathname.startsWith("/clash")) {
          configBuilder = new ClashConfigBuilder(inputString, selectedRules, customRules, baseConfig, lang2, userAgent);
        } else {
          configBuilder = new SurgeConfigBuilder(inputString, selectedRules, customRules, baseConfig, lang2, userAgent).setSubscriptionUrl(url.href);
        }
        const config = await configBuilder.build();
        const headers = {
          "content-type": url.pathname.startsWith("/singbox") ? "application/json; charset=utf-8" : url.pathname.startsWith("/clash") ? "text/yaml; charset=utf-8" : "text/plain; charset=utf-8"
        };
        if (url.pathname.startsWith("/surge")) {
          headers["subscription-userinfo"] = "upload=0; download=0; total=10737418240; expire=2546249531";
        }
        return new Response(
          url.pathname.startsWith("/singbox") ? JSON.stringify(config, null, 2) : config,
          { headers }
        );
      } else if (url.pathname === "/shorten") {
        const originalUrl = url.searchParams.get("url");
        if (!originalUrl) {
          return new Response(t("missingUrl"), { status: 400 });
        }
        const shortCode = GenerateWebPath();
        await SUBLINK_KV.put(shortCode, originalUrl);
        const shortUrl = `${url.origin}/s/${shortCode}`;
        return new Response(JSON.stringify({ shortUrl }), {
          headers: { "Content-Type": "application/json" }
        });
      } else if (url.pathname === "/shorten-v2") {
        const originalUrl = url.searchParams.get("url");
        let shortCode = url.searchParams.get("shortCode");
        if (!originalUrl) {
          return new Response("Missing URL parameter", { status: 400 });
        }
        const parsedUrl = new URL(originalUrl);
        const queryString = parsedUrl.search;
        if (!shortCode) {
          shortCode = GenerateWebPath();
        }
        await SUBLINK_KV.put(shortCode, queryString);
        return new Response(shortCode, {
          headers: { "Content-Type": "text/plain" }
        });
      } else if (url.pathname.startsWith("/b/") || url.pathname.startsWith("/c/") || url.pathname.startsWith("/x/") || url.pathname.startsWith("/s/")) {
        const shortCode = url.pathname.split("/")[2];
        const originalParam = await SUBLINK_KV.get(shortCode);
        let originalUrl;
        if (url.pathname.startsWith("/b/")) {
          originalUrl = `${url.origin}/singbox${originalParam}`;
        } else if (url.pathname.startsWith("/c/")) {
          originalUrl = `${url.origin}/clash${originalParam}`;
        } else if (url.pathname.startsWith("/x/")) {
          originalUrl = `${url.origin}/xray${originalParam}`;
        } else if (url.pathname.startsWith("/s/")) {
          originalUrl = `${url.origin}/surge${originalParam}`;
        }
        if (originalUrl === null) {
          return new Response(t("shortUrlNotFound"), { status: 404 });
        }
        return Response.redirect(originalUrl, 302);
      } else if (url.pathname.startsWith("/xray")) {
        const inputString = url.searchParams.get("config");
        const proxylist = inputString.split("\n");
        const finalProxyList = [];
        let userAgent = url.searchParams.get("ua");
        if (!userAgent) {
          userAgent = "curl/7.74.0";
        }
        let headers = new Headers({
          "User-Agent": userAgent
        });
        for (const proxy of proxylist) {
          if (proxy.startsWith("http://") || proxy.startsWith("https://")) {
            try {
              const response = await fetch(proxy, {
                method: "GET",
                headers
              });
              const text = await response.text();
              let decodedText;
              decodedText = decodeBase64(text.trim());
              if (decodedText.includes("%")) {
                decodedText = decodeURIComponent(decodedText);
              }
              finalProxyList.push(...decodedText.split("\n"));
            } catch (e) {
              console.warn("Failed to fetch the proxy:", e);
            }
          } else {
            finalProxyList.push(proxy);
          }
        }
        const finalString = finalProxyList.join("\n");
        if (!finalString) {
          return new Response("Missing config parameter", { status: 400 });
        }
        return new Response(encodeBase64(finalString), {
          headers: { "content-type": "application/json; charset=utf-8" }
        });
      } else if (url.pathname === "/favicon.ico") {
        return Response.redirect("https://cravatar.cn/avatar/9240d78bbea4cf05fb04f2b86f22b18d?s=160&d=retro&r=g", 301);
      } else if (url.pathname === "/config") {
        const { type: type2, content } = await request.json();
        const configId = `${type2}_${GenerateWebPath(8)}`;
        try {
          let configString;
          if (type2 === "clash") {
            if (typeof content === "string" && (content.trim().startsWith("-") || content.includes(":"))) {
              const yamlConfig = js_yaml_default.load(content);
              configString = JSON.stringify(yamlConfig);
            } else {
              configString = typeof content === "object" ? JSON.stringify(content) : content;
            }
          } else {
            configString = typeof content === "object" ? JSON.stringify(content) : content;
          }
          JSON.parse(configString);
          await SUBLINK_KV.put(configId, configString, {
            expirationTtl: 60 * 60 * 24 * 30
            // 30 days
          });
          return new Response(configId, {
            headers: { "Content-Type": "text/plain" }
          });
        } catch (error) {
          console.error("Config validation error:", error);
          return new Response(t("invalidFormat") + error.message, {
            status: 400,
            headers: { "Content-Type": "text/plain" }
          });
        }
      } else if (url.pathname === "/resolve") {
        const shortUrl = url.searchParams.get("url");
        if (!shortUrl) {
          return new Response(t("missingUrl"), { status: 400 });
        }
        try {
          const urlObj = new URL(shortUrl);
          const pathParts = urlObj.pathname.split("/");
          if (pathParts.length < 3) {
            return new Response(t("invalidShortUrl"), { status: 400 });
          }
          const prefix = pathParts[1];
          const shortCode = pathParts[2];
          if (!["b", "c", "x", "s"].includes(prefix)) {
            return new Response(t("invalidShortUrl"), { status: 400 });
          }
          const originalParam = await SUBLINK_KV.get(shortCode);
          if (originalParam === null) {
            return new Response(t("shortUrlNotFound"), { status: 404 });
          }
          let originalUrl;
          if (prefix === "b") {
            originalUrl = `${url.origin}/singbox${originalParam}`;
          } else if (prefix === "c") {
            originalUrl = `${url.origin}/clash${originalParam}`;
          } else if (prefix === "x") {
            originalUrl = `${url.origin}/xray${originalParam}`;
          } else if (prefix === "s") {
            originalUrl = `${url.origin}/surge${originalParam}`;
          }
          return new Response(JSON.stringify({ originalUrl }), {
            headers: { "Content-Type": "application/json" }
          });
        } catch (error) {
          return new Response(t("invalidShortUrl"), { status: 400 });
        }
      }
      return new Response(t("notFound"), { status: 404 });
    } catch (error) {
      console.error("Error processing request:", error);
      return new Response(t("internalError"), { status: 500 });
    }
  }
  __name(handleRequest, "handleRequest");
})();
/*! Bundled license information:

js-yaml/dist/js-yaml.mjs:
  (*! js-yaml 4.1.0 https://github.com/nodeca/js-yaml @license MIT *)
*/
//# sourceMappingURL=index.js.map
