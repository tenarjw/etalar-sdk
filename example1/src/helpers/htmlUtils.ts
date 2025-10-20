import DOMPurify from 'dompurify'

export const sanitize = ( content : any) => {
  return process.browser ? DOMPurify.sanitize( content ) : content;
};
