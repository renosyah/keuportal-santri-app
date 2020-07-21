<template>
    <div class="headerComponent">
        <div id="custom-navbar-fixed">
            <nav>
                <div id="header-nav" class="nav-wrapper black">
                    <a id="header-title" class="brand-logo left white-text">SMK MUHAMMADIYAH PAKEM</a>
                    <a><i class="material-icons right">dehaze</i></a>
                </div>
            </nav>
        </div>
    </div>
</template>

<style scoped>
.headerComponent {
    margin-bottom: 30px;
}


#header-title{
    font-size: 18px;
}

#header-nav {
    padding-left: 10px;
    padding-right: 10px;
}

#custom-navbar-fixed{
    overflow: hidden;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 9;
}

a {
    cursor: pointer;
}
</style>