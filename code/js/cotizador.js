
var app = angular.module('cotizador', []);

app.controller('cotizar', function($scope, $http, $location){

	$scope.dias = [];
	$scope.provincias = [];
	$scope.pedido = {};
	$scope.fechaDia = "";
	$scope.date = '';
	$scope.informacion = {
		paquete: {},
		mostrar:false
	};

	$scope.movimientos = [];

	$scope.menu = {
		paquete:{
			descripcion: ""
		},
		otro:{
			descripcion: ""
		},
		articulo:{
			cantidad:1,
			descripcion: ""
		},
		km:{
			hora:"",
			origenLugar:"",
			destinoLugar:"",
			tipo: "1",
			cantidad: "",
			habilitado : false
		}
	};

	$scope.paneles = {
		mostrarDias: true,
		mostraropciones: false,
		mostrarcostos: false,
		mostrarkmvacio: false,
		mostrarkm: false
	};

	$scope.total = {
		dias: 0,
		movimientos: 0
	};

	$scope.categorias_lista = [
		{ id: 1, nombre:"Semicama" },
		{ id: 2, nombre:"Semicama-Ejecutivo" },
		{ id: 3, nombre:"Ejecutivo-Cama" },
		{ id: 4, nombre:"Suite" }
	];

	$scope.movimiento = { //Tiene los datos del formulario que se va completando
		tipo: 0,
		cantidad:"0", 
		origen:"", 
		destino:"", 
		hora:"", 
		descripcion:"", 
		dia:""
	};

	$scope.simbolos = [
		{ id:0 , detalle:"$", posicion:0 },
		{ id:1 , detalle:"km", posicion:1 },
		{ id:2 , detalle:"km vacio", posicion:1 }		
	];

	$scope.opciones = {
		verVacios:false,
		otra:false,
		verPedido:false,
		diaActivo:"",
		pedido_minimizado: false
	};

	$scope.viaje = {
		categoria: 0,
		choferes: 1,
		fecha: "",
		id_pedido: "",
		costoTotal: 0,
		pasajeros: 26,
		cliente_tipo : 0,
		total: 0,
		subtotales : []
	};

	$scope.km = {
		tipo:0
	};

	$scope.precios = {
		total:0
	};

	$scope.init = function(){

		//console.log("funcion init");

		$scope.cargarCategorias();

		$scope.cargarProvincias();

		$scope.cargarPaquetes();

		$scope.cargarArticulos();

		//--------ASIGNA EL ID DE FORMULARIO RECIBIDO CON PHP A LA VARIABLE CORRESPONDIENTE
		$scope.viaje.id_pedido = $("#id_pedido").val();

		$scope.cargarPedido();		
	};

	$scope.cargarCategorias = function(){
		$http({method: 'POST', url: 'AJAX_categorias_listar.php'})
			.success(function(data, status, headers, config){

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}

				$scope.categorias_lista = data.datos;
				$scope.viaje.categoria = $scope.categorias_lista[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.cargarPaquetes = function(){
		$http({method: 'POST', url: 'AJAX_paquetes_listar.php'})
			.success(function(data, status, headers, config){

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}

				$scope.paquetes_lista = data.datos;
				$scope.menu.paquete.datos = $scope.paquetes_lista[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.cargarArticulos = function(){
		$http({method: 'POST', url: 'AJAX_articulos_listar.php'})
			.success(function(data, status, headers, config){

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}

				$scope.articulos_lista = data.datos;
				$scope.menu.articulo.datos = $scope.articulos_lista[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.cargarProvincias = function(){
		//--------LLENA LOS SELECT DE LUGARES (ORIGENES Y DESTINOS)
    	$http({method: 'POST', url: 'AJAX_provincias_listar.php'})
			.success(function(data, status, headers, config){
				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}

				$scope.provincias = data.datos;
				$scope.menu.km.origen = $scope.provincias[0];
				$scope.menu.km.destino = $scope.provincias[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.cargarPedido = function(){
		console.log("function cargarPedido");

		//--------LLENA EL FORMULARIO
		if( $scope.viaje.id_pedido != "" ){
			var datos = {
				id: $scope.viaje.id_pedido
			};

			$http({method: 'POST', url: 'AJAX_pedido_detalle.php', data: datos})
			.success(function(data, status, headers, config){
				var errores = 0;
				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					alert(data.errores[i]);
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					alert(data.alertas[i]);
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				$scope.pedido = data.datos;

				$scope.viaje.fecha = $scope.convertirFecha($scope.pedido.fecha_hora_partida);
				$scope.cargarTarifas();

				$scope.viaje.pasajeros = parseInt($scope.pedido.cant_pasajeros,10);

				for (var i = $scope.categorias_lista.length - 1; i >= 0; i--) {
					if($scope.categorias_lista[i].id == $scope.pedido.id_categoria){
						$scope.viaje.categoria = $scope.categorias_lista[i];
						break;
					}
				};


			})
			.error(function(data, status, headers, config){
				console.log("error");
			});

			$scope.opciones.verPedido = true;
		}
	};

	$scope.cargarTarifas = function(){
		//--------LLENA EL FORMULARIO
		var datos = {
			fecha: $scope.viaje.fecha
		};

		$http({method: 'POST', url: 'AJAX_tarifas_listar.php', data: datos})
		.success(function(data, status, headers, config){

			for(var i=0; i<data.errores.length; i++){
				console.log(data.errores[i]);
				alert(data.errores[i]);
				errores++;
			}

			for(var i=0; i<data.alertas.length; i++){
				console.log(data.alertas[i]);
				alert(data.alertas[i]);
				errores++;
			}

			if(data.consulta != ""){
				console.log(data.consulta);
			}

			$scope.tarifas = data.datos;
		})
		.error(function(data, status, headers, config){
			console.log("error");
		});
	};

	$scope.agregarDia = function(){
		if(new Date($scope.viaje.fecha) == "Invalid Date")
			return false;
		
		$scope.dias.push( {
			agregados: [
				{ tipo:3, activo:true, valor: null }, // Desayuno
				{ tipo:4, activo:true, valor: null }, // Almuerzo
				{ tipo:5, activo:true, valor: null }, // MediaTarde
				{ tipo:6, activo:true, valor: null }, // Cena
				{ tipo:7, activo:false, valor: $scope.tarifas[7].precio }, // Aloj
				{ tipo:0, activo:true, valor: null } //dia
			],
			kms:[],
			paquetes:[],
			articulos:[],
			otros:[],
			choferes : $scope.viaje.choferes
		});

		$scope.cotizarViaje();
		$scope.menu.km.dia = 1;
		$scope.menu.paquete.dia = 1;
		$scope.menu.articulo.dia = 1;
		$scope.menu.otro.dia = 1;

		$(".agregados label").each(function(){
			$(this).tooltip({container: 'body', placement: 'bottom'});
		});
	};

	$scope.eliminarDia = function(index){
		var id = $scope.dias[index].id;
		$scope.dias.splice(index, 1);
	};

	$scope.kmAgregar = function(){

		var horaMascara = new RegExp("([01]?[0-9]|2[0-3]):[0-5][0-9]");

		if($scope.menu.km.hora != "" && !horaMascara.test($scope.menu.km.hora) ){
			alert("La hora de ser ingresada en el formato HH:MM o nada\nEJ: 23:30");
			return false;
		}

		if($scope.menu.km.cantidad == "")
			return false;

		var hora = $scope.menu.km.hora;
		var h = hora.split(":");
		console.log(h);
		var fechaHora = new Date($scope.generarFecha($scope.menu.km.dia-1));

		fechaHora.setHours(h[0]);
		fechaHora.setMinutes(h[1]);

		$scope.dias[$scope.menu.km.dia-1].kms.push({
			cantidad: $scope.menu.km.cantidad,
			origenProvincia: $scope.menu.km.origenProvincia,
			origenLugar: $scope.menu.km.origenLugar,
			destinoProvincia: $scope.menu.km.destinoProvincia,
			destinoLugar: $scope.menu.km.destinoLugar,
			tipo: $scope.menu.km.tipo,
			hora: $scope.menu.km.hora,
			descripcion: $scope.menu.km.descripcion,
			llegada: $scope.calcularHorallegada($scope.menu.km.cantidad, fechaHora)
		});
	};

	$scope.paqueteAgregar = function(){

		$scope.dias[$scope.menu.paquete.dia-1].paquetes.push({
			datos: $scope.menu.paquete.datos,
			descripcion: $scope.menu.paquete.descripcion
		});
	};

	$scope.articuloAgregar = function(){
		$scope.dias[$scope.menu.articulo.dia-1].articulos.push({
			datos: $scope.menu.articulo.datos,
			cantidad: $scope.menu.articulo.cantidad,
			descripcion: $scope.menu.articulo.descripcion
		});
	};

	$scope.otroAgregar = function(){

		if( $scope.menu.otro.precio == "" || $scope.menu.otro.descripcion == "" ){
			alert("Debe ingresar un precio y una descripción");
			return false;
		}

		$scope.dias[$scope.menu.otro.dia-1].otros.push({
			precio: $scope.menu.otro.precio,
			descripcion: $scope.menu.otro.descripcion
		});
	};

	$scope.calcularHorallegada = function(kms, fechaHora){
		var horas = kms / 75;
		horas = Math.round( horas*60*60*1000 );

		fechaHora.setTime( fechaHora.getTime() + horas );

		var dia = fechaHora.getDate();
		if(dia < 10){
			var cero = 0;
			dia = (cero.toString() + fechaHora.getDate().toString() );
		}

		var mes = fechaHora.getMonth() + 1;
		if(mes < 10){
			var cero = 0;
			mes= (cero.toString() + fechaHora.getMonth().toString() );
		}

		var hora = fechaHora.getHours();
		if(hora < 10){
			var cero = 0;
			hora = (cero.toString() + fechaHora.getHours().toString() );
		}

		var minutos = fechaHora.getMinutes() + 1;
		if(minutos < 10){
			var cero = 0;
			minutos = (cero.toString() + fechaHora.getMinutes().toString() );
		}

		return dia +"/"+ mes + "/" +fechaHora.getFullYear() +" "+ hora +":"+ minutos;
	};

	$scope.stringTipoKm  = function(valor){
		if(valor == "2")
			return "Km vacios";
		else
			return "Km";
	};

	$scope.actualizarContenidoDePaquete = function(id, event){

		//--------Si es el mismo ID no vuelve a cargar los datos
		if(id == $scope.informacion.paquete.id){
			var x = event.clientX;
			var y = event.clientY;

			var ventanaInfo = document.getElementById("infodepaquete");
			ventanaInfo.style.top = (y + 20) + 'px';
			ventanaInfo.style.left = (x + 20) + 'px';

			$scope.informacion.mostrar = true;

			return true;
		}

		$scope.informacion.paquete = {};

		var datos = {
			id: id
		};

		//--------LLENA EL FORMULARIO

		$http({method: 'POST', url: 'AJAX_paquetes_contenido_listar.php', data: datos})
		.success(function(data, status, headers, config){

			for(var i=0; i<data.errores.length; i++){
				console.log(data.errores[i]);
				alert(data.errores[i]);
				errores++;
			}

			for(var i=0; i<data.alertas.length; i++){
				console.log(data.alertas[i]);
				alert(data.alertas[i]);
				errores++;
			}

			if(data.consulta != ""){
				console.log(data.consulta);
			}

			$scope.informacion.paquete = data.datos;

			var x = event.clientX;
			var y = event.clientY;

			var ventanaInfo = document.getElementById("infodepaquete");
			ventanaInfo.style.top = (y + 20) + 'px';
			ventanaInfo.style.left = (x + 20) + 'px';

			$scope.informacion.mostrar = true;
		})
		.error(function(data, status, headers, config){
			console.log("error");
		});
	};

	$scope.generarFecha = function(index){
		var myDate = new Date( $scope.viaje.fecha );
		myDate.setDate(myDate.getDate()+index+1);

		return myDate;
	};

	$scope.sumarTotales = function(){
		$scope.viaje.costoTotal = parseInt($scope.total.dias, 10)+parseInt($scope.total.movimientos, 10);
		return $scope.viaje.costoTotal;
	};

	$scope.eliminarKm = function(dia,index){
		$scope.dias[dia].kms.splice(index, 1);
		console.log("Se elimino Km "+(index+1)+" de día "+(dia+1));
	};

	$scope.eliminarPaquete = function(dia,index){
		$scope.dias[dia].paquetes.splice(index, 1);
		console.log("Se elimino paquete "+(index+1)+" de día "+(dia+1));
	};

	$scope.eliminarArticulo = function(dia,index){
		$scope.dias[dia].articulos.splice(index, 1);
		console.log("Se elimino artículo "+(index+1)+" de día "+(dia+1));
	};

	$scope.eliminarOtro = function(dia,index){
		$scope.dias[dia].otros.splice(index, 1);
		console.log("Se elimino otro "+(index+1)+" de día "+(dia+1));
	};

	$scope.filtro_actividad = function(dia){
	    	
    	var hayMovimientos = false;

    	if(dia.kms.length || dia.paquetes.length || dia.articulos.length || dia.otros.length){
    		hayMovimientos = true;
    	}
		
        return ( dia.agregados[0].activo || dia.agregados[1].activo || dia.agregados[2].activo || dia.agregados[3].activo || dia.agregados[4].activo || dia.agregados[5].activo || hayMovimientos || $scope.opciones.verVacios);
	};

	$scope.localidadGetNombre = function(id){
		for( var i=0; i < $scope.provincias.length; i++ ){
			if( $scope.provincias[i].id == id ){
				return $scope.provincias[i].nombre;
			}
		}
	};

	$scope.colocarSimbolo = function(tipo, dato){
		for( var i=0; i < $scope.simbolos.length; i++ ){
			if( $scope.simbolos[i].id == tipo){
				if($scope.simbolos[i].posicion == 1){
					return dato + " " + $scope.simbolos[i].detalle;
				}
				else{
					return $scope.simbolos[i].detalle + " " + dato;
				}
			}
		}
	};

	$scope.destildarBoton = function(item){
		var index = $scope.dias.indexOf(item);
		var dia = $scope.dias[index];

		if( dia.agregados[0].activo || dia.agregados[1].activo || dia.agregados[2].activo || dia.agregados[3].activo || dia.agregados[4].activo || dia.agregados[5].activo ){
			dia.ninguno = false;
		}
	};

	$scope.destildarTodos = function(item){
		var index = $scope.dias.indexOf(item);
		var dia = $scope.dias[index];

		dia.agregados[0].activo=!dia.ninguno;
		dia.agregados[1].activo=!dia.ninguno;
		dia.agregados[2].activo=!dia.ninguno;
		dia.agregados[3].activo=!dia.ninguno;
		dia.agregados[4].activo=!dia.ninguno;
		dia.agregados[5].activo=!dia.ninguno;
	};

	$scope.cotizarViaje = function(){

		if( $scope.viaje.fecha == "" || $scope.viaje.categoria == 0 ){
			return false;
		}

		var datos = {
			viaje: $scope.viaje,
			dias: $scope.dias
		};

		$http({method: 'POST', url: 'AJAX_cotizar_viaje.php', data:datos })
			.success(function(data, status, headers, config){

				for(var i=0; i<data.errores.length; i++){
					alert(data.errores[i]);
				}
				for(var i=0; i<data.alertas.length; i++){
					alert(data.alertas[i]);
				}
				if( data.consulta.length > 0){
					console.log(data.consulta);
				}

				$scope.viaje.total = data.datos.total;
				for( var i = 0 ; i <data.datos.subtotales.length;i++){
					$scope.viaje.subtotales[i] = data.datos.subtotales[i];
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.cotizacionGuardar = function(){

		var datos = {
			viaje: $scope.viaje,
			dias: $scope.dias
		};

		$http({method: 'POST', url: 'AJAX_cotizacion_guardar.php', data:datos })
			.success(function(data, status, headers, config){

				var error = false;
				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					error = true;
				}
				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
				}
				for(var i=0; i<data.consulta.length; i++){
					console.log(data.consulta[i]);
				}

				if(error)
					return 0;

				alert("Cotizacion guardada");
				window.location.href="cotizacion_buscar.php"
			})
			.error(function(data, status, headers, config){
				alert("error");
			});
	};

	$scope.solofloat = function(texto){

		var text = texto.toString().split("");

		if( text.indexOf(".") != -1 )
			text.splice(text.indexOf(".") , 1);

		text = parseInt(text.join("").toString()).toString();
		if(text == "NaN")
			return "0.00";
		text = text.split("");

		while(text.length<3){
			text.splice(0,0,"0");
		}
		
		text.splice(-2,0,".");

		return text.join("");
	};

	$scope.diaSeleccionar = function(index){
		if($scope.opciones.diasMover){
			$scope.opciones.diaActivo = index;
		}
	};

	$scope.dia_subir = function(){
		var index = $scope.opciones.diaActivo;
		if($scope.opciones.diasMover && index != "")
			if(index != 0){
				$scope.dias.splice(index-1,0,$scope.dias.splice(index,1)[0]);
				$scope.opciones.diaActivo--;
			}
	};

	$scope.dia_bajar = function(){
		var index = $scope.opciones.diaActivo;
		if($scope.opciones.diasMover)
			if(index != $scope.dias.length-1){
				$scope.dias.splice(index+1,0,$scope.dias.splice(index,1)[0]);
				$scope.opciones.diaActivo++;
			}
	};

	$scope.intercambiarOrigenDestino = function(){
		var intercambio = $scope.menu.km.origenProvincia;
		$scope.filtroOrig = "";
		$scope.filtroDest = "";

		$scope.menu.km.origenProvincia = $scope.menu.km.destinoProvincia;
		$scope.menu.km.destinoProvincia = intercambio; 

		var intercambio = $scope.menu.km.origenLugar;

		$scope.menu.km.origenLugar = $scope.menu.km.destinoLugar;
		$scope.menu.km.destinoLugar = intercambio;
	};

	$scope.convertirFecha = function(dato, mostrarHora){
		dato = dato.replace(/^\s+|\s+$/g, '');
		var hora = "";
		var fecha = "";

		console.log("convertirFecha con hora");

		if( dato.indexOf(" ") !== -1 && dato.length > "12" ){
			var n = dato.split(" ");
			dato = n[0];
			hora = " "+n[1];
		}
		if( dato.indexOf("/") === -1 ){
			var n = dato.split("-");
			var año = n[0];
			var mes = n[1];
			var dia = n[2];
			fecha = dia+"/"+mes+"/"+año;
		}
		else{
			var n = dato.split("/");
			var año = n[2];
			var mes = n[1];
			var dia = n[0];
			fecha = año+"-"+mes+"-"+dia;
		}

		if(mostrarHora){
			return fecha+hora;
		}
		else{
			return fecha;
		}
	};

	$scope.alternarMenuPedido = function(){
		$scope.opciones.pedido_minimizado = ($scope.opciones.pedido_minimizado)?false:true;		
	};

	$scope.$watch("[dias, movimientos]", function(){ $scope.cotizarViaje();}, true);
	$scope.$watch("[viaje.choferes]", function(){ $scope.cambiar_choferes();}, true);

	$scope.cambiar_choferes = function(){
		for(var i=0;i<$scope.dias.length;i++){
			$scope.dias[i].choferes = $scope.viaje.choferes;
		}
	};

//----------------------Agregado Martin--------------------------------------------------------------------------------------------------------

	$scope.focus_precio_alojam = function(index){
		var id = '$("#'+index+'input-small").focus()';
		setTimeout (id, 100);
	};

	$scope.verificar_num = function(){
		if($scope.menu.km.cantidad < 0){
			$scope.menu.km.cantidad = 0;
		}
		$scope.habilitar_km();
	};

	$scope.habilitar_km = function(){
		if($scope.menu.km.hora == "" || $scope.menu.km.origenLugar == "" || $scope.menu.km.destinoLugar == "" || $scope.menu.km.cantidad == "" || $scope.dias.length == 0){
			$scope.menu.km.habilitado = false;
		}
		else{
			$scope.menu.km.habilitado = true;
		}
	};

});

app.directive('datepicker', function() {
	return {
		restrict: 'A',
		require : 'ngModel',
		link : function (scope, element, attrs, ngModelCtrl) {
			$(function(){
				element.datepicker({
					dateFormat:'yy-mm-dd',
					onSelect:function (fecha) {
						ngModelCtrl.$setViewValue(fecha);
						scope.$apply();
					}
				});
			});
		}
	};
});