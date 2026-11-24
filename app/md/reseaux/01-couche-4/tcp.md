# TCP

## Principe

TCP est un protocole **orienté connexion** qui garantit l'ordre et la livraison des données.

### Poignée de main

1. `SYN`
2. `SYN-ACK`
3. `ACK`

> À retenir : pas de données avant la fin de la poignée de main.

### Fermeture

La fermeture utilise `FIN` et `ACK` dans chaque sens.

## Exemple Python

```python
import socket

with socket.create_connection(("example.com", 80)) as s:
    s.sendall(b"GET / HTTP/1.0\r\n\r\n")
    print(s.recv(1024))
```

## Comparaison TCP / UDP

| Critère       | TCP | UDP |
|---------------|:---:|:---:|
| Connexion     | Oui | Non |
| Ordre garanti | Oui | Non |
