import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@kit/ui/select';
import { Trans } from '@kit/ui/trans';

type Role = string;

export const MembershipRoleSelector: React.FC<{
  roles: Role[];
  value: Role;
  currentUserRole?: Role;
  onChange: (role: Role) => unknown;
}> = ({ roles, value, currentUserRole, onChange }) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger data-test={'role-selector-trigger'}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        {roles.map((role) => {
          return (
            <SelectItem
              key={role}
              data-test={`role-option-${role}`}
              disabled={currentUserRole === role}
              value={role}
            >
              <span className={'text-sm capitalize'}>
                <Trans i18nKey={`common:roles.${role}.label`} defaults={role} />
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
};
