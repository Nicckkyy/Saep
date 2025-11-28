from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api.views import ProdutoViewSet, MovimentacaoViewSet, login_view, registrar_movimentacao

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)
router.register(r'movimentacoes', MovimentacaoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/login/', login_view),
    path('api/estoque/movimentar/', registrar_movimentacao),
]