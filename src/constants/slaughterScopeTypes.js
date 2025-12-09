export const SLAUGHTER_SCOPE_TYPES = [
    {
        value: 'Hauptgriff',
        label: 'events.slaughter.details.scope_main'
    }, {
        value: 'Vorgriff',
        label: 'events.slaughter.details.scope_side'
    }
]

export const SLAUGHTER_SCOPE_TYPE_OPTIONS = [
    {
        value: 'all',
        label: 'general.all'
    },
    ...SLAUGHTER_SCOPE_TYPES,
]
