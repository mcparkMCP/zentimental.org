export interface PetitionSignature {
  id: string;
  name: string;
  createdAt: number;
}

export interface PetitionData {
  signatures: PetitionSignature[];
  count: number;
}
