export class TableColumn
{
  constructor(public field: string,
              public header: string,
              public width: string,
              public text_align: string,
              public field_type: FieldType,
              public visible?: boolean,
              public header_col_hint?: string)
  {
  }
}

export enum FieldType
{
  TEXT,
  DATE,
  NUMBER,
  INTEGER,
  MONEY,
  MONEY5,
  CHECKBOX,
  PERCENT,
  PERIOD,
  PROGRESS,
  NUMBER2,
  NUMBER3,
  NUMBER5,
  NUMBER6,
  YES_NO,
  QUARTER  = 15,
  DATETIME = 16,
}
