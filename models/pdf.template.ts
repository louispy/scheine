export interface PdfTemplate {
  [key: string]: (data: any) => Promise<string>;
}
