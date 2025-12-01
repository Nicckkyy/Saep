from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView  # Importante: Permite renovar o token
from api.views import ProdutoViewSet, MovimentacaoViewSet, login_view, registrar_movimentacao

router = DefaultRouter()
router.register(r'produtos', ProdutoViewSet)
router.register(r'movimentacoes', MovimentacaoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Rotas geradas automaticamente pelo Router (Produtos e Listagem de Movimentações)
    path('api/', include(router.urls)),

    # Autenticação
    path('api/login/', login_view, name='login'),  # Nossa view manual que gera o token
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'), # Padrão JWT para renovar acesso

    # Funcionalidade Específica
    path('api/estoque/movimentar/', registrar_movimentacao, name='movimentar_estoque'),
]