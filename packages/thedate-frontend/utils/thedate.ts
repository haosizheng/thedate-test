
import dateFormat from 'dateformat';

export const SECONDS_IN_A_DAY = 86400;

export function blockTimestampToUTC(timestamp: number) {
  return dateFormat(new Date(timestamp * 1000), "UTC:mmm d yyyy HH:MM:ss Z");
}

export function blockTimestampToDate(timestamp: number) {
  return dateFormat(new Date(timestamp * 1000), "mmm d yyyy").toUpperCase();
}

export function jsDateToDate(date: Date) {
  return dateFormat(date, "mmm d yyyy").toUpperCase();
}

export function ISODateToTokenId(isoDate: string) {
  return Math.floor(new Date(isoDate).valueOf() / SECONDS_IN_A_DAY / 1000);
}

export function tokenIdToDateString(tokenId: number) {
  return dateFormat(new Date(tokenId * SECONDS_IN_A_DAY * 1000), "mmm d yyyy").toUpperCase();
}

export function tokenIdToISODateString(tokenId: number) {
  return dateFormat(new Date(tokenId * SECONDS_IN_A_DAY * 1000), "yyyy-mm-dd");
}