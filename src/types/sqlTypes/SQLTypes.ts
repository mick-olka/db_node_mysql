export interface QueryError {
  code?: string | null;
  errno?: number | null;
  sqlMessage?: string | null;
  sqlState?: string | null;
  index?: number | null;
  sql?: string | null;
}

export interface QueryResI {
  table: {
    result: any[],
    fields: any[]
  };
  err: QueryError | null;
}

interface FieldInfoI {
  "catalog": string,
  "db": string,
  "table": string,
  "orgTable": string,
  "name": string,
  "orgName": string,
  "charsetNr": number,
  "length": number,
  "type": number,
  "flags": number,
  "decimals": number,
  "zeroFill": boolean,
  "protocol41": boolean
}

export interface QueryDBResI {
  body: DBRowT[],
  fields: FieldInfoI[],
  err: any
}

export interface TableInfoI {
  TABLE_NAME: string,
  TABLE_ROWS: number
}

export interface DovTovI {
  k_tt: number,
  n_tt: string
}
export interface DovFirmI {
  k_firm: number,
  n_firm: string
}
export interface RealTovI {
  k_pp: number,
  kil: number,
  d_real: string,
  d_spl: string,
  index: number
}
export interface PreyskurantI {
  k_pp: number,
  k_firm: number,
  k_tt: number,
  c_yo: number
}

export interface InsertionResI {
  "fieldCount": number,
  "affectedRows": number,
  "insertId": number,
  "serverStatus": number,
  "warningCount": number,
  "message": string,
  "protocol41": boolean,
  "changedRows": number
}

export interface UserDataI {
  id: number,
  name: string,
  code: string,
  mobile: string,
  email: string,
  status: 1 | 2 | 3 //  r-- \ rw- \ rwd
}

export type DBRowT = Array<DovTovI | DovFirmI | PreyskurantI | RealTovI | TableInfoI | UserDataI>;
