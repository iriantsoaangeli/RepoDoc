
## Liste de commandes 
### Commandes de base 
```
#Demarrer ou quiter le mode rom 
boot

#Mode privilegie 
enable

#Terminal de configuration
configure terminal

#Config d'une interface 
interface
```

### Commandes de routages
```
#Afficher les routes 
show ip route 

#Ajouter une route
ip route <target> <mask> <gateway>

#Access-list 
access-list 1 <action> <network>

#Activer access list
ip access-group 1 in

#Translation d'adresse (nat statique)
ip nat inside source static  <ip entrant> <ip sortant>
ip nat inside
ip nat outside

#Montrer table de nat 
show ip nat translations 

debug ip nat
```
