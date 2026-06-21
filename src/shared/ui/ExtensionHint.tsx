/** Подсказка: расширения браузера часто ломают загрузку скриптов и стилей. */
export function ExtensionHint({ className = '' }: { className?: string }) {
  return (
    <p className={`text-sm text-muted-foreground ${className}`.trim()}>
      Расширения вроде <strong className="font-semibold text-foreground">AdBlock</strong>, блокировщиков
      рекламы и переводчиков могут мешать работе сайта. Отключите их для этого домена или откройте сайт
      в режиме инкогнито без расширений.
    </p>
  )
}
