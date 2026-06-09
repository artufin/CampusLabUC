interface MemberChipProps {
  name: string;
}

export function MemberChip({ name }: MemberChipProps) {
  return <span className="m-pill">{name}</span>;
}
