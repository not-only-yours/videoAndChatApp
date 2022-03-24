echo "change folder"
cd /opt/application/workspace/VideoChat

echo "run docker compose"
docker-compose up -d --force-recreate

echo "rerun proxy"
docker exec nginx nginx -s reload
