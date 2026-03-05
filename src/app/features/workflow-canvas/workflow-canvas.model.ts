export interface INode {
  id: string;
  label: string;
  position: { x: number; y: number };
}

export interface IConnection {
  outputId: string;
  inputId: string;
}
