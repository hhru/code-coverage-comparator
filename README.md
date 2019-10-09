## Code-coverage-comparator

Позволяет сравнить два результата code-coverage для дальнейшего уведомления в PR об увеличении или уменьшении процента покрытия кода тестами по сравнению с master.

### Использование

1. Устанавливаем:

```
yarn add --dev @hh.ru/code-coverage-comparator
```

или

```
npm install --dev @hh.ru/code-coverage-comparator
```

2. В CI/CD системе:

2.1) При сборке создаем дополнительный контейнер с нужным проектом. (в разных проектах может делаться по разному)
2.2) В job добавляем запуск тестов с code coverage опцией на мастере и на ветке.
2.3) После сборки code coverage добавляем скрипт, который вызывает этот модуль:

```js
const comparator = require('@hh.ru/code-coverage-comparator');
comparator('path/to/your/master.xml', 'path/to/you/branch.xml', 'path/to/you/result.json');
```

Репорт будет доступен в `path/to/you/result.json` или если данных стало меньше в `stderr`
