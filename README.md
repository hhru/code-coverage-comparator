## Code-coverage-comparator

Позволяет сравнить два результата code-coverage для дальнейшего уведомления в PR об увеличении или уменьшении процента покрытия кода тестами по сравнению с master.

### Использование

1) Устанавливаем:
```
yarn add --dev @hh.ru/code-coverage-comparator
```

или
```
npm install --dev @hh.ru/code-coverage-comparator
```

2) В CI/CD системе:

2.1) При сборке создаем дополнительный контейнер с нужным проектом. (в разных проектах может делаться по разному)
2.2) В job добавляем запуск тестов с code coverage опцией на мастере и на ветке. 
2.3) После сборки code coverage добавляем:
```
 yarn @hh.ru/code-coverage-comparator --path-master ${path/to/your/master.xml} --path-branch ${path/to/you/branch.xml}
```

Репорт будет доступен в `coverage-stats-report.json` или если данных стало меньше в `stderr`