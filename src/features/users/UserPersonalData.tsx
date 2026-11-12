import { Button } from '../../components/ui/Button.tsx'
import { Card, CardHeader } from '../../components/ui/Card.tsx'
import { DescriptionItem, DescriptionItemSkeleton, DescriptionList } from '../../components/ui/DescriptionList.tsx'
import { Skeleton } from '../../components/ui/Skeleton.tsx'
import { GENDER_LABELS, type User } from '../../types/user.ts'

const TITLE = 'Datos personales y de contacto'
const DESCRIPTION = 'Campos del registro USER.'

/** Every USER field as label/value pairs, with an edit shortcut. */
export function UserPersonalData({ user, onEdit }: { user: User; onEdit: () => void }) {
  return (
    <Card aria-labelledby="personal-data-title" className="gap-space-md p-space-lg">
      <CardHeader
        titleId="personal-data-title"
        icon="person"
        title={TITLE}
        description={DESCRIPTION}
        action={
          <Button variant="secondary" icon="edit" onClick={onEdit}>
            Modificar datos
          </Button>
        }
      />

      <DescriptionList>
        <DescriptionItem label="Nombre">{user.first_name}</DescriptionItem>
        <DescriptionItem label="Apellido">{user.last_name}</DescriptionItem>
        <DescriptionItem label="Email">
          <a href={`mailto:${user.email}`} className="underline-offset-2 hover:text-primary hover:underline">
            {user.email}
          </a>
        </DescriptionItem>
        <DescriptionItem label="Teléfono">
          {user.telephone ? (
            <span className="font-mono">{user.telephone}</span>
          ) : (
            <span className="font-normal text-outline">No registrado</span>
          )}
        </DescriptionItem>
        <DescriptionItem label="Género">{GENDER_LABELS[user.gender]}</DescriptionItem>
        <DescriptionItem label="Edad">{user.age} años</DescriptionItem>
      </DescriptionList>
    </Card>
  )
}

export function UserPersonalDataSkeleton() {
  return (
    <Card aria-hidden="true" className="gap-space-md p-space-lg">
      <CardHeader icon="person" title={TITLE} description={DESCRIPTION} action={<Skeleton className="h-8 w-36" tone="muted" />} />
      <DescriptionList>
        {Array.from({ length: 6 }, (_, i) => (
          <DescriptionItemSkeleton key={i} />
        ))}
      </DescriptionList>
    </Card>
  )
}
