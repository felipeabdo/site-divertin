/**
 * File formats accepted by the public contact form.
 * Unknown extensions are passed as application/octet-stream, while executable
 * formats blocked by Titan are rejected before upload.
 */
export const MAX_TOTAL_ATTACHMENT_SIZE = 17 * 1024 * 1024;
export const MAX_ATTACHMENTS = 10;

export const CONTACT_ATTACHMENT_MIME_TYPES: Record<string, string> = {
  // Documents and text
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  xlsm: 'application/vnd.ms-excel.sheet.macroEnabled.12',
  ods: 'application/vnd.oasis.opendocument.spreadsheet',
  odt: 'application/vnd.oasis.opendocument.text',
  odp: 'application/vnd.oasis.opendocument.presentation',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  rtf: 'application/rtf',
  txt: 'text/plain',
  md: 'text/markdown',
  markdown: 'text/markdown',
  csv: 'text/csv',
  tsv: 'text/tab-separated-values',
  json: 'application/json',
  xml: 'application/xml',
  yaml: 'application/yaml',
  yml: 'application/yaml',
  log: 'text/plain',

  // Audio
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  wave: 'audio/wav',
  m4a: 'audio/mp4',
  mp4a: 'audio/mp4',
  aac: 'audio/aac',
  ogg: 'audio/ogg',
  oga: 'audio/ogg',
  opus: 'audio/opus',
  flac: 'audio/flac',
  wma: 'audio/x-ms-wma',
  aiff: 'audio/aiff',
  aif: 'audio/aiff',
  amr: 'audio/amr',
  mid: 'audio/midi',
  midi: 'audio/midi',

  // Video
  mp4: 'video/mp4',
  m4v: 'video/x-m4v',
  mov: 'video/quicktime',
  qt: 'video/quicktime',
  avi: 'video/x-msvideo',
  mkv: 'video/x-matroska',
  webm: 'video/webm',
  wmv: 'video/x-ms-wmv',
  mpeg: 'video/mpeg',
  mpg: 'video/mpeg',
  mpe: 'video/mpeg',
  '3gp': 'video/3gpp',
  '3g2': 'video/3gpp2',
  mts: 'video/mp2t',
  m2ts: 'video/mp2t',
  ts: 'video/mp2t',
  ogv: 'video/ogg',

  // Images and scans commonly sent to a speech-language clinic
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  bmp: 'image/bmp',
  tif: 'image/tiff',
  tiff: 'image/tiff',
  heic: 'image/heic',
  heif: 'image/heif',

  // Archives and compressed files (Titan accepts ZIP attachments)
  zip: 'application/zip',
  '7z': 'application/x-7z-compressed',
  rar: 'application/vnd.rar',
  tar: 'application/x-tar',
  gz: 'application/gzip',
  bz2: 'application/x-bzip2',
  xz: 'application/x-xz',
};

// Titan blocks these executable/script formats in email attachments.
// Its support documentation recommends placing a blocked file inside a ZIP.
export const TITAN_BLOCKED_EXTENSIONS = new Set([
  'ade', 'adp', 'apk', 'bat', 'chm', 'cmd', 'com', 'cpl', 'dll', 'dmg',
  'exe', 'hta', 'ins', 'isp', 'jar', 'js', 'jse', 'lib', 'lnk', 'mde',
  'msc', 'msi', 'msp', 'mst', 'nsh', 'pif', 'scr', 'sct', 'shb', 'sys',
  'vb', 'vbe', 'vbs', 'vxd', 'wsc', 'wsf', 'wsh', 'cab',
]);

export function contactAttachmentMimeType(filename: string): string | null {
  const extension = filename.split('.').pop()?.toLowerCase() || '';
  if (!extension || TITAN_BLOCKED_EXTENSIONS.has(extension)) return null;
  return CONTACT_ATTACHMENT_MIME_TYPES[extension] || 'application/octet-stream';
}
