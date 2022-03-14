echo "get dependencies"
apt update
apt install docker.io certbot
curl -L "https://github.com/docker/compose/releases/download/1.26.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose


echo "generate certs"
certbot certonly --standalone -d nikitasdomain.tk --staple-ocsp -m darty@nikitasdomain.tk --agree-tos


echo "create network"
sudo docker network create my-pre-existing-network


echo "run docker compose"
docker-compose up -d

CMD ["npm", "start"]