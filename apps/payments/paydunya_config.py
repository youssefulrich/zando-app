import paydunya
from django.conf import settings

paydunya.setup(
    settings.PAYDUNYA_MASTER_KEY,
    settings.PAYDUNYA_PUBLIC_KEY,
    settings.PAYDUNYA_PRIVATE_KEY,
    settings.PAYDUNYA_TOKEN,
)

paydunya.mode = settings.PAYDUNYA_MODE
