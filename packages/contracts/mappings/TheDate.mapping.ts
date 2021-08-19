import { BigInt, log } from "@graphprotocol/graph-ts"

import { ArtworkMinted, ArtworkNoteEngraved } from '../generated/TheDate/TheDate'
import { TheDate } from '../generated/schema'

export function handleArtworkMinted(event: ArtworkMinted): void {
  let id = event.params.tokenId.toHex();
  let theDate = new TheDate(id);
  theDate.note = "";
  theDate.save();
}

export function handleArtworkNoteEngraved(event: ArtworkNoteEngraved): void {
  let id = event.params.tokenId.toHex();
  let theDate = TheDate.load(id)
  if (theDate == null) {
    theDate = new TheDate(id)
  }
  theDate.note = event.params.note
  theDate.save()
}
