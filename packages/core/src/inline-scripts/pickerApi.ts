export type PentovideoPickerBoundingBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type PentovideoPickerElementInfo = {
  id: string | null;
  tagName: string;
  selector: string;
  label: string;
  boundingBox: PentovideoPickerBoundingBox;
  textContent: string | null;
  src: string | null;
  dataAttributes: Record<string, string>;
};

export type PentovideoPickerApi = {
  enable: () => void;
  disable: () => void;
  isActive: () => boolean;
  getHovered: () => PentovideoPickerElementInfo | null;
  getSelected: () => PentovideoPickerElementInfo | null;
  getCandidatesAtPoint: (
    clientX: number,
    clientY: number,
    limit?: number,
  ) => PentovideoPickerElementInfo[];
  pickAtPoint: (
    clientX: number,
    clientY: number,
    index?: number,
  ) => PentovideoPickerElementInfo | null;
  pickManyAtPoint: (
    clientX: number,
    clientY: number,
    indexes?: number[],
  ) => PentovideoPickerElementInfo[];
};

declare global {
  interface Window {
    __HF_PICKER_API?: PentovideoPickerApi;
  }
}
