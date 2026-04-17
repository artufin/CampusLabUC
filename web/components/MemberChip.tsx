interface MemberChipProps {
  name: string;
}

export function MemberChip({ name }: MemberChipProps) {
  return <div className="member-chip">{name}</div>;
}
