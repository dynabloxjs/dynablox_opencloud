// Get balanced parentheses
// Ported from: https://github.com/juliangruber/balanced-match/blob/master/index.js
function maybeMatch(reg, str) {
    const m = str.match(reg);
    return m ? m[0] : null;
}
/**
 * For the first non-nested matching pair of a and b in str, return an object with those keys:
 * start the index of the first match of
 * `end` the index of the matching b
 * `pre` the preamble, a and b not included
 * `body` the match, a and b not included
 * `post` the postscript, a and b not included
 * If there's no match, `undefined` will be returned.
 * If the `str` contains more a than b / there are unmatched pairs,
 * the first match that was closed will be used.
 * For example, `{{a}` will match `['{', 'a', '']` and `{a}}` will match `['', 'a', '}']`
 */
export function balanced(a, b, str) {
    if (a instanceof RegExp)
        a = maybeMatch(a, str);
    if (b instanceof RegExp)
        b = maybeMatch(b, str);
    const r = range(a, b, str);
    return (r && {
        start: r[0] ?? 0,
        end: r[1] ?? 0,
        pre: str.slice(0, r[0]),
        body: str.slice(r[0] + a.length, r[1]),
        post: str.slice(r[1] + b.length),
    });
}
/**
 * For the first non-nested matching pair of `a` and `b` in `str`,
 * return an array with indexes: `[ <a index>, <b index> ]`.
 */
export function range(a, b, str) {
    let begs, beg, left, right, result;
    let ai = str.indexOf(a);
    let bi = str.indexOf(b, ai + 1);
    let i = ai;
    if (ai >= 0 && bi > 0) {
        if (a === b) {
            return [ai, bi];
        }
        begs = [];
        left = str.length;
        while (i >= 0 && !result) {
            if (i === ai) {
                begs.push(i);
                ai = str.indexOf(a, i + 1);
            }
            else if (begs.length === 1) {
                result = [begs.pop(), bi];
            }
            else {
                beg = begs.pop();
                if (beg < left) {
                    left = beg;
                    right = bi;
                }
                bi = str.indexOf(b, i + 1);
            }
            i = ai < bi && ai >= 0 ? ai : bi;
        }
        if (begs.length) {
            result = [left, right];
        }
    }
    return result;
}
// Ported from: https://github.com/mugendi/balanced-match-all/blob/master/index.js
export function balancedAll(pre, post, str, includeInside = false, includeOutside = true, level = 0, arr = []) {
    const o = balanced(pre, post, str);
    if (o) {
        arr.push(o);
        const idx = arr.length - 1;
        if (idx > 0) {
            o.start += arr[idx - 1].start + pre.length;
            o.end += arr[idx - 1].start + post.length;
        }
        // loop till all are called
        if (includeInside) {
            arr = balancedAll(pre, post, o.body, includeInside, includeOutside, level++, arr);
        }
        if (includeOutside && arr[idx].end < (str.length - 1)) {
            arr = balancedAll(pre, post, str.slice(arr[idx].end - 1), includeInside, true, 0, arr);
        }
    }
    return arr;
}
