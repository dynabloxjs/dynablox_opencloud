"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashEncodeCallback = exports.searchEncodeCallback = exports.pathURLPathnameEncodeCallback = exports.standardURLPathnameEncodeCallback = exports.portEncodeCallback = exports.ipv6HostnameEncodeCallback = exports.hostnameEncodeCallback = exports.passwordEncodeCallback = exports.usernameEncodeCallback = exports.protocolEncodeCallback = exports.defaultPortForProtocol = exports.canonicalizeProtocol = exports.canonicalizePort = exports.canonicalizePathname = exports.canonicalizeUsername = exports.canonicalizePassword = exports.canonicalizeHostname = exports.canonicalizeSearch = exports.canonicalizeHash = exports.isSpecialScheme = exports.SPECIAL_SCHEMES = exports.treatAsIPv6Hostname = exports.isAbsolutePathname = exports.PATHNAME_OPTIONS = exports.HOSTNAME_OPTIONS = exports.DEFAULT_OPTIONS = void 0;
// default to strict mode and case sensitivity.  In addition, most
// components have no concept of a delimiter or prefix character.
exports.DEFAULT_OPTIONS = {
    delimiter: "",
    prefixes: "",
    sensitive: true,
    strict: true,
};
// The options to use for hostname patterns.  This uses a
// "." delimiter controlling how far a named group like ":bar" will match
// by default.  Note, hostnames are case insensitive but we require case
// sensitivity here.  This assumes that the hostname values have already
// been normalized to lower case as in URL().
exports.HOSTNAME_OPTIONS = {
    delimiter: ".",
    prefixes: "",
    sensitive: true,
    strict: true,
};
// The options to use for pathname patterns.  This uses a
// "/" delimiter controlling how far a named group like ":bar" will match
// by default.  It also configures "/" to be treated as an automatic
// prefix before groups.
exports.PATHNAME_OPTIONS = {
    delimiter: "/",
    prefixes: "/",
    sensitive: true,
    strict: true,
};
// Utility function to determine if a pathname is absolute or not.  For
// URL values this mainly consists of a check for a leading slash.  For
// patterns we do some additional checking for escaped or grouped slashes.
function isAbsolutePathname(pathname, isPattern) {
    if (!pathname.length) {
        return false;
    }
    if (pathname[0] === "/") {
        return true;
    }
    if (!isPattern) {
        return false;
    }
    if (pathname.length < 2) {
        return false;
    }
    // Patterns treat escaped slashes and slashes within an explicit grouping as
    // valid leading slashes.  For example, "\/foo" or "{/foo}".  Patterns do
    // not consider slashes within a custom regexp group as valid for the leading
    // pathname slash for now.  To support that we would need to be able to
    // detect things like ":name_123(/foo)" as a valid leading group in a pattern,
    // but that is considered too complex for now.
    if ((pathname[0] == "\\" || pathname[0] == "{") && pathname[1] == "/") {
        return true;
    }
    return false;
}
exports.isAbsolutePathname = isAbsolutePathname;
function maybeStripPrefix(value, prefix) {
    if (value.startsWith(prefix)) {
        return value.substring(prefix.length, value.length);
    }
    return value;
}
function maybeStripSuffix(value, suffix) {
    if (value.endsWith(suffix)) {
        return value.substr(0, value.length - suffix.length);
    }
    return value;
}
function treatAsIPv6Hostname(value) {
    if (!value || value.length < 2) {
        return false;
    }
    if (value[0] === "[") {
        return true;
    }
    if ((value[0] === "\\" || value[0] === "{") &&
        value[1] === "[") {
        return true;
    }
    return false;
}
exports.treatAsIPv6Hostname = treatAsIPv6Hostname;
exports.SPECIAL_SCHEMES = [
    "ftp",
    "file",
    "http",
    "https",
    "ws",
    "wss",
];
function isSpecialScheme(protocol_regexp) {
    if (!protocol_regexp) {
        return true;
    }
    for (const scheme of exports.SPECIAL_SCHEMES) {
        if (protocol_regexp.test(scheme)) {
            return true;
        }
    }
    return false;
}
exports.isSpecialScheme = isSpecialScheme;
function canonicalizeHash(hash, isPattern) {
    hash = maybeStripPrefix(hash, "#");
    if (isPattern || hash === "") {
        return hash;
    }
    const url = new URL("https://example.com");
    url.hash = hash;
    return url.hash ? url.hash.substring(1, url.hash.length) : "";
}
exports.canonicalizeHash = canonicalizeHash;
function canonicalizeSearch(search, isPattern) {
    search = maybeStripPrefix(search, "?");
    if (isPattern || search === "") {
        return search;
    }
    const url = new URL("https://example.com");
    url.search = search;
    return url.search ? url.search.substring(1, url.search.length) : "";
}
exports.canonicalizeSearch = canonicalizeSearch;
function canonicalizeHostname(hostname, isPattern) {
    if (isPattern || hostname === "") {
        return hostname;
    }
    if (treatAsIPv6Hostname(hostname)) {
        return ipv6HostnameEncodeCallback(hostname);
    }
    else {
        return hostnameEncodeCallback(hostname);
    }
}
exports.canonicalizeHostname = canonicalizeHostname;
function canonicalizePassword(password, isPattern) {
    if (isPattern || password === "") {
        return password;
    }
    const url = new URL("https://example.com");
    url.password = password;
    return url.password;
}
exports.canonicalizePassword = canonicalizePassword;
function canonicalizeUsername(username, isPattern) {
    if (isPattern || username === "") {
        return username;
    }
    const url = new URL("https://example.com");
    url.username = username;
    return url.username;
}
exports.canonicalizeUsername = canonicalizeUsername;
function canonicalizePathname(pathname, protocol, isPattern) {
    if (isPattern || pathname === "") {
        return pathname;
    }
    if (protocol && !exports.SPECIAL_SCHEMES.includes(protocol)) {
        const url = new URL(`${protocol}:${pathname}`);
        return url.pathname;
    }
    const leadingSlash = pathname[0] == "/";
    pathname = new URL(!leadingSlash ? "/-" + pathname : pathname, "https://example.com").pathname;
    if (!leadingSlash) {
        pathname = pathname.substring(2, pathname.length);
    }
    return pathname;
}
exports.canonicalizePathname = canonicalizePathname;
function canonicalizePort(port, protocol, isPattern) {
    if (defaultPortForProtocol(protocol) === port) {
        port = "";
    }
    if (isPattern || port === "") {
        return port;
    }
    return portEncodeCallback(port);
}
exports.canonicalizePort = canonicalizePort;
function canonicalizeProtocol(protocol, isPattern) {
    protocol = maybeStripSuffix(protocol, ":");
    if (isPattern || protocol === "") {
        return protocol;
    }
    return protocolEncodeCallback(protocol);
}
exports.canonicalizeProtocol = canonicalizeProtocol;
function defaultPortForProtocol(protocol) {
    switch (protocol) {
        case "ws":
        case "http":
            return "80";
        case "wws":
        case "https":
            return "443";
        case "ftp":
            return "21";
        default:
            return "";
    }
}
exports.defaultPortForProtocol = defaultPortForProtocol;
function protocolEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    if (/^[-+.A-Za-z0-9]*$/.test(input)) {
        return input.toLowerCase();
    }
    throw new TypeError(`Invalid protocol '${input}'.`);
}
exports.protocolEncodeCallback = protocolEncodeCallback;
function usernameEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    const url = new URL("https://example.com");
    url.username = input;
    return url.username;
}
exports.usernameEncodeCallback = usernameEncodeCallback;
function passwordEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    const url = new URL("https://example.com");
    url.password = input;
    return url.password;
}
exports.passwordEncodeCallback = passwordEncodeCallback;
function hostnameEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    if (/[\t\n\r #%/:<>?@[\]^\\|]/g.test(input)) {
        throw (new TypeError(`Invalid hostname '${input}'`));
    }
    const url = new URL("https://example.com");
    url.hostname = input;
    return url.hostname;
}
exports.hostnameEncodeCallback = hostnameEncodeCallback;
function ipv6HostnameEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    if (/[^0-9a-fA-F[\]:]/g.test(input)) {
        throw (new TypeError(`Invalid IPv6 hostname '${input}'`));
    }
    return input.toLowerCase();
}
exports.ipv6HostnameEncodeCallback = ipv6HostnameEncodeCallback;
function portEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    // Since ports only consist of digits there should be no encoding needed.
    // Therefore we directly use the UTF8 encoding version of CanonicalizePort().
    if ((/^[0-9]*$/.test(input) && parseInt(input) <= 65535)) {
        return input;
    }
    throw new TypeError(`Invalid port '${input}'.`);
}
exports.portEncodeCallback = portEncodeCallback;
function standardURLPathnameEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    const url = new URL("https://example.com");
    url.pathname = input[0] !== "/" ? "/-" + input : input;
    if (input[0] !== "/") {
        return url.pathname.substring(2, url.pathname.length);
    }
    return url.pathname;
}
exports.standardURLPathnameEncodeCallback = standardURLPathnameEncodeCallback;
function pathURLPathnameEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    const url = new URL(`data:${input}`);
    return url.pathname;
}
exports.pathURLPathnameEncodeCallback = pathURLPathnameEncodeCallback;
function searchEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    const url = new URL("https://example.com");
    url.search = input;
    return url.search.substring(1, url.search.length);
}
exports.searchEncodeCallback = searchEncodeCallback;
function hashEncodeCallback(input) {
    if (input === "") {
        return input;
    }
    const url = new URL("https://example.com");
    url.hash = input;
    return url.hash.substring(1, url.hash.length);
}
exports.hashEncodeCallback = hashEncodeCallback;
