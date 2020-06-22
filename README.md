# API prostej aplikacji TODO

  API umożliwia dodawanie oraz zarządzanie listą TODO z możliwością przypisania do poszczególego TODO pozycji (w postaci GeoJson). Po zapisaniu następuje konwersja do formatu PostGIS Geometry i zapis do bazy danych. Podczas pobierania danych pole pozycji jest konwertowane ponownie do formatu GeoJson.

# OPIS API
    [POST] /ToDos - Dodawanie nowego TODO do bazy z punktem w formacie GEOJSON lub bez.
    [PATH] /ToDos - Zmiana właściwości pozycji TODO, pominięcie właściwości nie powoduje jej usunięcia.
                    Aby usunąć (np. pozycję) musimy przypisać jej wartość null.
    [DELETE] /ToDos/{id} - Usuwanie konkretnego TODO na podstawie ID.
    [GET] /ToDos - Pobranie szystkich TODO.
    [GET] /ToDos/{id} - Pobranie konkretnego TODO na podstawie ID.

# URUCHOMIENIE
    Aplikację możęmy uruchomić w Dockerach przy pomocy "docker-compose"
    poleceniem "docker-compose up -d". Utworzone zostaną dwa dockery: 
    pierwszy z aplikacją, drugi z działającą bazą PostgreSQL z zainstalowanym
    dodadkiem PostGIS. API dostępne będzie na porcie "3000" a baza danyc na porcie "5432".
    
    Możemy pominąć dockery i uruchomić aplikację jako klasyczną nodo'wą aplikację przy pomocy
    polecenia "npm run start". Należy wtedy mieć przygotowaną bazę danych PostgreSQL
    z zainstalowanym dodatkiem PostGIS oraz poprawnie skonfigurować połącznie
    z bazą w pliku "server/datasources/json"
    
    przykładowy plik:
    {
      "geo_todo_db": {
       "host": "localhost",
       "port": 5432,
       "url": "",
       "database": "geo_todo",
       "password": "1qazXSW@1qaz",
       "name": "geo_todo_db",
       "user": "admin",
       "connector": "postgresql"
    }
  }
