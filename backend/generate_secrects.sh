ACCESS_TOKEN=$(openssl rand -base64 32)
REFRESH_TOKEN=$(openssl rand -base64 32)

ENV_FILE=".env"

sed -i /^JWT/d $ENV_FILE

echo "JWT_ACCESS_SECRET=\"$ACCESS_TOKEN\"" >> $ENV_FILE
echo "JWT_REFRESH_TOKEN=\"$REFRESH_TOKEN\"" >> $ENV_FILE

echo "Secrets added to $ENV_FILE"