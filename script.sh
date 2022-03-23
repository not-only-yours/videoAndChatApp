echo "change folder"
cd /opt/application/workspace/VideoChat

echo "run docker compose"
docker-compose up -d --no-cache

echo "rerun proxy"
docker start nginx
