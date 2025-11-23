import i18n from '../i18n'

export default function getMenuLabel(open, label, ns) {
  const t = i18n.getFixedT(i18n.language, ['common', ns])

  const labelT = t(label, { ns })
  const action = t(open ? 'close_x' : 'open_x', { ns: 'common', x: labelT })

  return action
}
