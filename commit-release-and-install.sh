#!/bin/bash
set -e

vtex setup -i

REPO=$(git remote get-url --push origin)
echo $'\n=============== Commiting changes to repository '$REPO
echo "Enter commit description: "
read description
git add .
git commit -m "$description"
git push origin main

echo $'\n=============== Releasing app'
vtex switch ssesandbox04
vtex release patch stable
vtex deploy --force --yes

echo $'\n=============== Intalling app on B2B Stores'
vtex switch bravtexfashionb2b
vtex use master
vtex install
vtex switch vtextitantools
vtex use master
vtex install
vtex switch vtexfashionb2b
vtex use master
vtex install
vtex switch kevinyeebiz
vtex use master
vtex install
