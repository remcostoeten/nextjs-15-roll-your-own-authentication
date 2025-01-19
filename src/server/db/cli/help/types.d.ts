declare module 'table-layout' {
  interface TableOptions {
    padding?: number;
    maxWidth?: number;
  }

  class TableLayout {
    constructor(data: Record<string, any>[], options?: TableOptions);
    toString(): string;
  }

  export = TableLayout;
} 