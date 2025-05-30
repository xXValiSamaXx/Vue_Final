<template> 
    <div>
        <!-- Footer estático: componente reutilizable sin comunicación con entidades -->
        <footer class="page-footer font-small blue">
          <!-- Copyright section: contenido estático sin binding dinámico -->
          <div class="footer-copyright text-center py-3">© 2020 Copyright:
            <!-- Enlace estático: no usa navegación programática de Vue Router -->
            <a href="https://mdbootstrap.com/">Hustle.com</a>
          </div>
        </footer>
    </div>
</template>

<script>
 export default {
     name: 'Footer'  // Componente simple sin props, computed, methods o hooks
 }
</script>

<style>
    /* CSS estático para componente de layout */
    footer {
        background: palegoldenrod;
        bottom: 0;
        position: fixed;  /* Posición fija independiente del estado de la aplicación */
        width: 100%;
    }
</style>