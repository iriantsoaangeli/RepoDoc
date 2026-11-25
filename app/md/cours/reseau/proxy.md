# Forward proxy(devant le client)
On a un navigateur , sur ce navigateur il y a un proxy  avant passer sur le net.  
On peut mettre un filtre sur un proxy  

Choses importantes : 
    - Le scope : lan ou sur le pc uniquemment , on choisit
    - On peut cacher les site et le redistribuer aux clients sans recharger au site
    - On peut dire quelle url autoriser
    - On peut imposer des regles de securite 
    
Tout les url passe par le proxy  

Logiciel de reference : squid  

**tldr :** reduire l'usage de bande avec cache , augmenter la securite

# Reverse Proxy(devant le serveur)
C'est un garde fou devant le server.  

A retenir :
    - Load balancer si besoin 
    - Securite : Dit ou non si les requetes passent 
    - Cache : n'utilise pas les resources si elle sont deja dans le cache

Logiciel de reference :haparoxy , ngix  

# API Gateway(Microservice)
Tres utile en microservice  
En clustering , on suppose que les server sont les meme et ont la meme techonologie , ce n'est pas le cas des microservices  
Le proxy reparti les charges selon les besoin de chaque microservice  

A retenir : 
    - routage , on evite d'appeler les services individuellement 
    - securite sur l'acces des services
    - Balancer les charges : il donne les resources aux server 

>NB: La defintion de clustering est tres differente d'une personne a une autre , eviter d'utiliser ce termees 

Logiciel de ref : pfsense


# CDN (Content delivery network )

On un tier qui heberge les assets : css , javascript , et on pratique les lien d'assets du site vont la bas  
Pourquoi :  
Optimiser la bande passante , normalement le html lorsqu'il est lu par le navgiteur de haut en bas il cree une nouvelle requetes pour les assets qu'il trouve  

Ca fait quoi :  
Le  navigateur voit le lien , la requete va vers l'hebergeur d'asset et leurs reverse proxy pointe au server le plus proche du client . Le site ne fait rien dans ce cas  

Point faible :  
double deploiement  






