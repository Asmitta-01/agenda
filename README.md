# About
This application implements a simple agenda with these funtionnalities:
 - Consult the agenda
 - Add a new event to the agenda
 - Modify an event

# Configuration
Assuming you are working in local, create your database with this command:
```bash
symfony console doctrine:database:create
```
You need to run this command in your terminal in other to have the categories, otherwise you will get an error(since each event must have a category)
```bash
symfony console doctrine:query:sql "INSERT INTO Category(name) VALUES('Birthday'), ('Wedding'), ('Meeting'), ('Conference'), ('Feast'), ('Other')"
```
You can replace the current values of the request with your own like this :
```sql
INSERT INTO Category(name) VALUES([Your-var]), ([Another-one]), ...
```
But i **don't advise** it...

If `symfony` is not recognized replace `symfony console` in your command by `php bin/console`.
e.g : `php bin/console doctrine:database:create`

After running these two previous commands, you should be able to launch the app:
```bash
symfony serve # or symfony server:start
```