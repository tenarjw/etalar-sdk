export const astr=(s : string | null): string => {
    return (s?s:'').replaceAll('"',"'")
//    return encodeURIComponent(s?s:'')
}
export const aint=(i : number | null): number => {
    return i ? i : 0
}
export const anum=(n : number | null): number => {
    return n ? n : 0.0
}
export const attps=(url : string | null): string => {
    if (url?.startsWith('https://')) return url
    else return 'https://'+ (url ? url : '*')
}
