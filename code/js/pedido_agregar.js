
var app = angular.module('pedido_agregar', []);

app.controller('controlador', function($scope, $http){

//	------------------------------------------------------------------------------------------------<variables>----------------------------------------------------------------------------------------------

	$scope.pagina = 1;

	$scope.buscador = {
		origen : {
			fila_activa : -1,
			mostrar : 0,
			provincias_filtradas : []
		},
		destino : {
			fila_activa : -1,
			mostrar : 0,
			provincias_filtradas : []
		},
		cliente : {
			fila_activa : -1,
			mostrar : 0,
			provincias_filtradas : []
		}
	};
//4050063
	$scope.viaje = {
		cant_pasajeros : "",
		origen_provincia : "",
		origen_id_provincia : 0,
		origen_lugar : "",
		destino_provincia : "",
		destino_id_provincia : "",
		destino_lugar : "",
		ida_regreso : "0",
		fecha_partida : "",
		hora_partida : "00:00:00",
		fecha_vuelta : "",
		hora_vuelta : "00:00:00",
		id_categoria : "1"
	};

	$scope.adicionales = {
		tipo_pasajeros : "5",
		desayuno_ida : "0",
		almuerzo_ida : "0",
		merienda_ida : "0",
		cena_ida : "0",
		desayuno_vuelta : "0",
		almuerzo_vuelta : "0",
		merienda_vuelta : "0",
		cena_vuelta : "0",
		alojamiento : "0",
		viaticos : "0",
		paradas_int : "0",
		paradas_int_ida : "",
		paradas_int_vuelta : "",
		movimientos_destino : "0",
		movimientos_destino_detalle : "",
		catering : "",
		comentarios : ""
	};

	$scope.cliente = {
		doc_tipo : "1",
		doc_numero : "",
		apellido: "",
		nombre : "",
		telefono : "",
		email : "",
		sexo : "1",
		provincia : "",
		id_provincia : "",
		localidad : "",
		calle : "",
		institucion : "",
		accion : "buscar"
	};

	$scope.datos = {
		viaje : $scope.viaje,
		adicionales: $scope.adicionales,
		cliente : $scope.cliente,
		id_usuario : 0
	};

	$scope.provincias = [];
	$scope.provincias_filtradas_destino = [];

//------------------------------------------------------------------------------------------------------</variables>----------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------<funciones>----------------------------------------------------------------------------------------------

//--------------------------------------------
	$scope.init = function(){

		$http({method: 'POST', url: 'AJAX_provincias_listar.php', data:$scope.provincia })
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
//					$scope.cliente.provincia = $scope.provincias[0];
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};
//------------------------------------

//------------------------------------
	$scope.enviar = function(){

			if(	$scope.cliente.doc_numero == "" ||
				$scope.cliente.apellido == "" || 
				$scope.cliente.nombre == "" || 
				$scope.cliente.telefono == "" || 
				$scope.cliente.email == ""){

					alert("Complete por favor sus datos personales requeridos antes de enviar su pedido");
			}

			else{
				if($("#id_usuario").val() == ""){
					$scope.datos.id_usuario = 0;
				}
				else{
					$scope.datos.id_usuario = $("#id_usuario").val();
				}

				$http({method: 'POST', url: 'AJAX_pedido_agregar.php', data:$scope.datos })
						.success(function(data, status, headers, config){
							var errores = 0;

							for(var i=0; i<data.errores.length; i++){
								console.log(data.errores[i]);
								errores++;
							}
							for(var i=0; i<data.alertas.length; i++){
								console.log(data.alertas[i]);
								errores++;
							}
							for(var i=0; i<data.consulta.length; i++){
								console.log(data.consulta[i]);
							}

		//					if(!errores){
								alert("Su pedido ha sido enviado, Gracias por contratar nuestros servicios");
								if($("#id_usuario").val() == ""){
									window.location.href = 'http://192.168.0.254/cve/pedido_agregar.php';
								}
								else{
									window.location.href = 'http://192.168.0.254/cve/pedido_agregar.php?id_usuario='+$scope.datos.id_usuario;
								}
		//					}

					})
					.error(function(data, status, headers, config){
						console.log("error");
					});
			}
	};

//------------------------------------

	$scope.buscar_cliente = function(){

		$scope.cliente.accion = "buscar";

		if($scope.cliente.doc_numero != ""){

			$http({method: 'POST', url: 'AJAX_clientes.php', data:$scope.cliente })
				.success(function(data, status, headers, config){
					var errores = 0;

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
						errores++;
					}

					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
						errores++;
					}

					if(data["datos"].length != 0){

						$scope.cliente.apellido		= data["datos"][0].apellido;
						$scope.cliente.nombre		= data["datos"][0].nombre;
						$scope.cliente.telefono		= data["datos"][0].telefono;
						$scope.cliente.email			= data["datos"][0].email;
						$scope.cliente.sexo			= data["datos"][0].sexo;
						$scope.cliente.provincia		= data["datos"][0].pais+"-"+data["datos"][0].provincia;
						$scope.cliente.id_provincia	= data["datos"][0].id_provincia;
						$scope.cliente.localidad		= data["datos"][0].localidad;
						$scope.cliente.calle			= data["datos"][0].calle;
						$scope.cliente.institucion		= data["datos"][0].institucion;
					}

					else{
						$scope.cliente.apellido		= "";
						$scope.cliente.nombre		= "";
						$scope.cliente.telefono		= "";
						$scope.cliente.email			= "";
						$scope.cliente.provincia		=$scope.provincias[0];
						$scope.cliente.localidad		= "";
						$scope.cliente.calle			= "";
						$scope.cliente.institucion		= "";
					}
			})

			.error(function(data, status, headers, config){
				console.log("error");
			});
		}

		if($scope.cliente.doc_numero == ""){
			$scope.cliente.apellido		= "";
			$scope.cliente.nombre		= "";
			$scope.cliente.telefono		= "";
			$scope.cliente.email			= "";
			$scope.cliente.provincia		=$scope.provincias[0];
			$scope.cliente.localidad		= "";
			$scope.cliente.calle			= "";
			$scope.cliente.institucion		= "";
		}
	};

//------------------------------------

	$scope.avanzar_pagina = function(){

		if($scope.pagina == 2){
			$scope.pagina++;
		}

		if($scope.pagina == 1){

			var mensaje = "";

			if($scope.viaje.cant_pasajeros == ""){
				mensaje += "cantidad de pasajeros\n";
			}
			if($scope.viaje.origen_id_provincia == ""){
				mensaje += "origen\n";
			} 
			if($scope.viaje.origen_lugar == ""){
				mensaje += "lugar de origen\n";
			}
			if($scope.viaje.destino_id_provincia == ""){
				mensaje += "destino\n";
			}
			if($scope.viaje.destino_lugar == ""){
				mensaje += "lugar de destino\n";
			}
			if($scope.viaje.fecha_partida == ""){
				mensaje += "fecha de partida\n";
			}
			if(($scope.viaje.fecha_vuelta == "") && ($scope.viaje.ida_regreso == 1)){
				mensaje += "fecha de vuelta\n";
			}
			if(mensaje != ""){
				alert("Porfavor, complete los siguientes campos antes de continuar:\n\n"+mensaje);
			}

			else{
				$scope.pagina++;
			}
		}
	};


//------------------------------------------------------------------------------------------------------------------<buscador de provincias destino>--------------------------------------------------------------------------------------
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//________________________________________________________________________________________________________________________
	$scope.evaluar_destino = function(e){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa			= $scope.buscador.destino.fila_activa;
		var texto_ingresado		= $scope.viaje.destino_provincia;
		var lista_filtrada		= $scope.buscador.destino.provincias_filtradas;
		var mostrar			= $scope.buscador.destino.mostrar;
		var id_elegido			= $scope.viaje.destino_id_provincia;
		//-----------------------------------------------------------------------------------------------------------

		var keynum = window.event ? window.event.keyCode : e.which;
		if(texto_ingresado == ""){
			return;
		}
		var cantidad =lista_filtrada.length;
		if(keynum == 40){
			if(fila_activa == (-1) || fila_activa == cantidad - 1){
				mostrar = 1;
				fila_activa = 0;

				for(var i = 0;i<cantidad;i++){
					if(i<9){
						lista_filtrada[i].mostrar = 1;
					}
					else{
						lista_filtrada[i].mostrar = 0;
					}
				}
			}
			else{
				fila_activa++;
				lista_filtrada[fila_activa].mostrar = 1;
				if(fila_activa >8){
					lista_filtrada[fila_activa - 9].mostrar = 0;
				}
			}
			texto_ingresado = lista_filtrada[fila_activa].nombre;
		}
		if(keynum == 38){
			if(fila_activa == (-1) || fila_activa == 0){
				mostrar = 1;
				fila_activa = cantidad - 1;
				for(var i = 0;i<cantidad;i++){
					if(i > cantidad - 10){
						lista_filtrada[i].mostrar = 1;
					}
					else{
						lista_filtrada[i].mostrar = 0;
					}
				}
			}
			else{
				fila_activa--;
				lista_filtrada[fila_activa].mostrar = 1;
				if(fila_activa <cantidad - 9){
					lista_filtrada[fila_activa + 9].mostrar = 0;
				}
			}
			texto_ingresado	= lista_filtrada[fila_activa].nombre;
		}

		if(keynum == 13 || keynum == 9){
			if(fila_activa != (-1)){
				id_elegido	=  lista_filtrada[fila_activa].id;
				fila_activa	= (-1);
				mostrar = 0;
				console.log(id_elegido);
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.destino.fila_activa			= fila_activa;
		$scope.buscador.destino.mostrar			= mostrar;
		$scope.buscador.destino.provincias_filtradas	= lista_filtrada;
		$scope.viaje.destino_provincia				= texto_ingresado;
		$scope.viaje.destino_id_provincia			= id_elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.verificar_coincidencias_destino = function(verificar){

		//-----------------------------------------------------------------------------------------------------------
		var lista					= $scope.provincias;
		var texto_ingresado			= $scope.viaje.destino_provincia;
		var id_elegido				= $scope.viaje.destino_id_provincia;
		var fila_activa				= $scope.buscador.destino.fila_activa;
		var lista_filtrada			= $scope.buscador.destino.provincias_filtradas
		//-----------------------------------------------------------------------------------------------------------
		if(verificar){
			var coincide	= false;

			for(var i = 0 ; i < lista.length ; i++){
				if(texto_ingresado == lista[i].nombre){
					coincide = true;
					break;
				}
			}

			if(coincide == false){
				texto_ingresado = "";
				id_elegido = "";
			};
		}

		if(fila_activa != (-1)){
			id_elegido	=  lista_filtrada[fila_activa].id;
			fila_activa	= (-1);
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.viaje.destino_provincia				= texto_ingresado;
		$scope.viaje.destino_id_provincia			= id_elegido;
		$scope.buscador.destino.mostrar			= 0;
		$scope.buscador.destino.fila_activa			= fila_activa;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.seleccionar_provincia_destino	= function(index){
		$scope.buscador.destino.fila_activa		= index;
		$scope.viaje.destino_provincia			= $scope.buscador.destino.provincias_filtradas[$scope.buscador.destino.fila_activa].nombre;
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.filtrador_destino = function(llamar_a_cambiar_mostrar){

		//-----------------------------------------------------------------------------------------------------------
		var lista				= $scope.provincias;
		var texto_ingresado		= $scope.viaje.destino_provincia;
		//-----------------------------------------------------------------------------------------------------------
		
		var mostrar = 1;
		var lista_filtrada = [];
		var coincide;
		var filtro = texto_ingresado.toLowerCase();
		var arreglo_filtro = filtro.split("");
		for(var i = 0; i< lista.length;i++){				//selecciono una provincia

			var arreglo_provincia = ( lista[i].nombre.toLowerCase()).split("");	//convierto la provincia en un array

			for(var j = 0; j< (arreglo_provincia.length - arreglo_filtro.length + 1);j++){
				var posicion = j;
				for(var k = 0;k<arreglo_filtro.length;k++){
					if(arreglo_filtro[k] == arreglo_provincia[posicion]){
						coincide = true;
						posicion++;
					}
					else{
						coincide = false;
						break;
					}
				}
				if(coincide == true){
					break;
				}
			}

			if(coincide == true){
				lista_filtrada.push(lista[i]);
			}
		}

		var id;
		for(var i = 0;i<lista_filtrada.length;i++){
			if(i<9){
				lista_filtrada[i].mostrar = 1;
			}
			else{
				lista_filtrada[i].mostrar = 0;
			}
		}

		if(llamar_a_cambiar_mostrar == 1){
			if (texto_ingresado != ""){
				if(lista_filtrada.length == 0){
					mostrar = 0;
				}
				else{
					mostrar = 1;
				}
			}
			else{
				mostrar = 0;
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.destino.provincias_filtradas		= lista_filtrada;
		$scope.buscador.destino.fila_activa				= -1;
		$scope.buscador.destino.mostrar				= mostrar;
		//-----------------------------------------------------------------------------------------------------------
		
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.scrollear_destino = function(evt){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa				=	$scope.buscador.destino.fila_activa;
		var lista_filtrada			=	$scope.buscador.destino.provincias_filtradas;
		var elegido				=	$scope.viaje.destino_provincia;
		//-----------------------------------------------------------------------------------------------------------

		if (!evt) evt = event;
		var direccion;
		(evt.detail<0) ? direccion = 1 : (evt.wheelDelta>0) ? direccion = 1 : direccion = -1;// console.log(direction);

		for( var i = 0;i<lista_filtrada.length;i++){
			if(lista_filtrada[i].mostrar == 1){
				break;
			}
		}

		if(direccion == 1){
			if(fila_activa > 0){
				fila_activa--;
				elegido	= lista_filtrada[fila_activa].nombre;
			}
			if(0 < i){
				 lista_filtrada[i-1].mostrar = 1;
				 lista_filtrada[i + 9].mostrar = 0;
			}
		}
		else{
			if(fila_activa <  lista_filtrada.length - 1){
				fila_activa++;
				elegido	=  lista_filtrada[fila_activa].nombre;
			}
			if(i+10 < lista_filtrada.length){
				lista_filtrada[i].mostrar = 0;
				lista_filtrada[i+10].mostrar = 1;
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.destino.fila_activa			= fila_activa;
		$scope.buscador.destino.provincias_filtradas	= lista_filtrada;
		$scope.viaje.destino_provincia				= elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//------------------------------------------------------------------------------------------------------------------<buscador de provincias origen>--------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//________________________________________________________________________________________________________________________
	$scope.evaluar_origen = function(e){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa			= $scope.buscador.origen.fila_activa;
		var texto_ingresado		= $scope.viaje.origen_provincia;
		var lista_filtrada		= $scope.buscador.origen.provincias_filtradas;
		var mostrar			= $scope.buscador.origen.mostrar;
		var id_elegido			= $scope.viaje.origen_id_provincia;
		//-----------------------------------------------------------------------------------------------------------

		var keynum = window.event ? window.event.keyCode : e.which;
		if(texto_ingresado == ""){
			return;
		}
		var cantidad =lista_filtrada.length;
		if(keynum == 40){
			if(fila_activa == (-1) || fila_activa == cantidad - 1){
				mostrar = 1;
				fila_activa = 0;

				for(var i = 0;i<cantidad;i++){
					if(i<9){
						lista_filtrada[i].mostrar = 1;
					}
					else{
						lista_filtrada[i].mostrar = 0;
					}
				}
			}
			else{
				fila_activa++;
				lista_filtrada[fila_activa].mostrar = 1;
				if(fila_activa >8){
					lista_filtrada[fila_activa - 9].mostrar = 0;
				}
			}
			texto_ingresado = lista_filtrada[fila_activa].nombre;
		}
		if(keynum == 38){
			if(fila_activa == (-1) || fila_activa == 0){
				mostrar = 1;
				fila_activa = cantidad - 1;
				for(var i = 0;i<cantidad;i++){
					if(i > cantidad - 10){
						lista_filtrada[i].mostrar = 1;
					}
					else{
						lista_filtrada[i].mostrar = 0;
					}
				}
			}
			else{
				fila_activa--;
				lista_filtrada[fila_activa].mostrar = 1;
				if(fila_activa <cantidad - 9){
					lista_filtrada[fila_activa + 9].mostrar = 0;
				}
			}
			texto_ingresado	= lista_filtrada[fila_activa].nombre;
		}

		if(keynum == 13 || keynum == 9){
			if(fila_activa != (-1)){
				id_elegido	=  lista_filtrada[fila_activa].id;
				fila_activa	= (-1);
				mostrar = 0;
				console.log(id_elegido);
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.origen.fila_activa			= fila_activa;
		$scope.buscador.origen.mostrar			= mostrar;
		$scope.buscador.origen.provincias_filtradas	= lista_filtrada;
		$scope.viaje.origen_provincia				= texto_ingresado;
		$scope.viaje.origen_id_provincia			= id_elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.verificar_coincidencias_origen = function(verificar){

		//-----------------------------------------------------------------------------------------------------------
		var lista					= $scope.provincias;
		var texto_ingresado			= $scope.viaje.origen_provincia;
		var id_elegido				= $scope.viaje.origen_id_provincia;
		var fila_activa				= $scope.buscador.origen.fila_activa;
		var lista_filtrada			= $scope.buscador.origen.provincias_filtradas
		//-----------------------------------------------------------------------------------------------------------
		if(verificar){
			var coincide	= false;

			for(var i = 0 ; i < lista.length ; i++){
				if(texto_ingresado == lista[i].nombre){
					coincide = true;
					break;
				}
			}

			if(coincide == false){
				texto_ingresado = "";
				id_elegido = "";
			};
		}

		if(fila_activa != (-1)){
			id_elegido	=  lista_filtrada[fila_activa].id;
			fila_activa	= (-1);
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.viaje.origen_provincia				= texto_ingresado;
		$scope.viaje.origen_id_provincia			= id_elegido;
		$scope.buscador.origen.mostrar			= 0;
		$scope.buscador.origen.fila_activa			= fila_activa;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.seleccionar_provincia_origen	= function(index){
		$scope.buscador.origen.fila_activa		= index;
		$scope.viaje.origen_provincia			= $scope.buscador.origen.provincias_filtradas[$scope.buscador.origen.fila_activa].nombre;
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.filtrador_origen = function(llamar_a_cambiar_mostrar){

		//-----------------------------------------------------------------------------------------------------------
		var lista				= $scope.provincias;
		var texto_ingresado		= $scope.viaje.origen_provincia;
		//-----------------------------------------------------------------------------------------------------------
		
		var mostrar = 1;
		var lista_filtrada = [];
		var coincide;
		var filtro = texto_ingresado.toLowerCase();
		var arreglo_filtro = filtro.split("");
		for(var i = 0; i< lista.length;i++){				//selecciono una provincia

			var arreglo_provincia = ( lista[i].nombre.toLowerCase()).split("");	//convierto la provincia en un array

			for(var j = 0; j< (arreglo_provincia.length - arreglo_filtro.length + 1);j++){
				var posicion = j;
				for(var k = 0;k<arreglo_filtro.length;k++){
					if(arreglo_filtro[k] == arreglo_provincia[posicion]){
						coincide = true;
						posicion++;
					}
					else{
						coincide = false;
						break;
					}
				}
				if(coincide == true){
					break;
				}
			}

			if(coincide == true){
				lista_filtrada.push(lista[i]);
			}
		}

		var id;
		for(var i = 0;i<lista_filtrada.length;i++){
			if(i<9){
				lista_filtrada[i].mostrar = 1;
			}
			else{
				lista_filtrada[i].mostrar = 0;
			}
		}

		if(llamar_a_cambiar_mostrar == 1){
			if (texto_ingresado != ""){
				if(lista_filtrada.length == 0){
					mostrar = 0;
				}
				else{
					mostrar = 1;
				}
			}
			else{
				mostrar = 0;
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.origen.provincias_filtradas		= lista_filtrada;
		$scope.buscador.origen.fila_activa				= -1;
		$scope.buscador.origen.mostrar				= mostrar;
		//-----------------------------------------------------------------------------------------------------------
		
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.scrollear_origen = function(evt){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa				=	$scope.buscador.origen.fila_activa;
		var lista_filtrada			=	$scope.buscador.origen.provincias_filtradas;
		var elegido				=	$scope.viaje.origen_provincia;
		//-----------------------------------------------------------------------------------------------------------

		if (!evt) evt = event;
		var direccion;
		(evt.detail<0) ? direccion = 1 : (evt.wheelDelta>0) ? direccion = 1 : direccion = -1;// console.log(direction);

		for( var i = 0;i<lista_filtrada.length;i++){
			if(lista_filtrada[i].mostrar == 1){
				break;
			}
		}

		if(direccion == 1){
			if(fila_activa > 0){
				fila_activa--;
				elegido	= lista_filtrada[fila_activa].nombre;
			}
			if(0 < i){
				 lista_filtrada[i-1].mostrar = 1;
				 lista_filtrada[i + 9].mostrar = 0;
			}
		}
		else{
			if(fila_activa <  lista_filtrada.length - 1){
				fila_activa++;
				elegido	=  lista_filtrada[fila_activa].nombre;
			}
			if(i+10 < lista_filtrada.length){
				lista_filtrada[i].mostrar = 0;
				lista_filtrada[i+10].mostrar = 1;
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.origen.fila_activa			= fila_activa;
		$scope.buscador.origen.provincias_filtradas	= lista_filtrada;
		$scope.viaje.origen_provincia				= elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________


//------------------------------------------------------------------------------------------------------------------<buscador de provincias cliente>--------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//________________________________________________________________________________________________________________________
	$scope.evaluar_cliente = function(e){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa			= $scope.buscador.cliente.fila_activa;
		var lista_filtrada		= $scope.buscador.cliente.provincias_filtradas;
		var mostrar			= $scope.buscador.cliente.mostrar;
		var texto_ingresado		= $scope.cliente.provincia;
		var id_elegido			= $scope.cliente.id_provincia;
		//-----------------------------------------------------------------------------------------------------------

		var keynum = window.event ? window.event.keyCode : e.which;
		if(texto_ingresado == ""){
			return;
		}
		var cantidad =lista_filtrada.length;
		if(keynum == 40){
			if(fila_activa == (-1) || fila_activa == cantidad - 1){
				mostrar = 1;
				fila_activa = 0;

				for(var i = 0;i<cantidad;i++){
					if(i<9){
						lista_filtrada[i].mostrar = 1;
					}
					else{
						lista_filtrada[i].mostrar = 0;
					}
				}
			}
			else{
				fila_activa++;
				lista_filtrada[fila_activa].mostrar = 1;
				if(fila_activa >8){
					lista_filtrada[fila_activa - 9].mostrar = 0;
				}
			}
			texto_ingresado = lista_filtrada[fila_activa].nombre;
		}
		if(keynum == 38){
			if(fila_activa == (-1) || fila_activa == 0){
				mostrar = 1;
				fila_activa = cantidad - 1;
				for(var i = 0;i<cantidad;i++){
					if(i > cantidad - 10){
						lista_filtrada[i].mostrar = 1;
					}
					else{
						lista_filtrada[i].mostrar = 0;
					}
				}
			}
			else{
				fila_activa--;
				lista_filtrada[fila_activa].mostrar = 1;
				if(fila_activa <cantidad - 9){
					lista_filtrada[fila_activa + 9].mostrar = 0;
				}
			}
			texto_ingresado	= lista_filtrada[fila_activa].nombre;
		}

		if(keynum == 13 || keynum == 9){
			if(fila_activa != (-1)){
				id_elegido	=  lista_filtrada[fila_activa].id;
				fila_activa	= (-1);
				mostrar = 0;
				console.log(id_elegido);
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.cliente.fila_activa			= fila_activa;
		$scope.buscador.cliente.mostrar			= mostrar;
		$scope.buscador.cliente.provincias_filtradas	= lista_filtrada;
		$scope.cliente.provincia					= texto_ingresado;
		$scope.cliente.id_provincia				= id_elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.verificar_coincidencias_cliente = function(verificar){

		//-----------------------------------------------------------------------------------------------------------
		var lista					= $scope.provincias;
		var texto_ingresado			= $scope.cliente.provincia;
		var id_elegido				= $scope.cliente.id_provincia;
		var fila_activa				= $scope.buscador.cliente.fila_activa;
		var lista_filtrada			= $scope.buscador.cliente.provincias_filtradas;
		//-----------------------------------------------------------------------------------------------------------
		if(verificar){
			var coincide	= false;

			for(var i = 0 ; i < lista.length ; i++){
				if(texto_ingresado == lista[i].nombre){
					coincide = true;
					break;
				}
			}

			if(coincide == false){
				texto_ingresado = "";
				id_elegido = "";
			};
		}

		if(fila_activa != (-1)){
			id_elegido	=  lista_filtrada[fila_activa].id;
			fila_activa	= (-1);
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.cliente.provincia					= texto_ingresado;
		$scope.cliente.id_provincia				= id_elegido;
		$scope.buscador.cliente.mostrar			= 0;
		$scope.buscador.cliente.fila_activa			= fila_activa;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.seleccionar_provincia_cliente	= function(index){
		$scope.buscador.cliente.fila_activa		= index;
		$scope.cliente.provincia			= $scope.buscador.cliente.provincias_filtradas[$scope.buscador.cliente.fila_activa].nombre;
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.filtrador_cliente = function(llamar_a_cambiar_mostrar){

		//-----------------------------------------------------------------------------------------------------------
		var lista				= $scope.provincias;
		var texto_ingresado		= $scope.cliente.provincia;
		//-----------------------------------------------------------------------------------------------------------
		
		var mostrar = 1;
		var lista_filtrada = [];
		var coincide;
		var filtro = texto_ingresado.toLowerCase();
		var arreglo_filtro = filtro.split("");
		for(var i = 0; i< lista.length;i++){				//selecciono una provincia

			var arreglo_provincia = ( lista[i].nombre.toLowerCase()).split("");	//convierto la provincia en un array

			for(var j = 0; j< (arreglo_provincia.length - arreglo_filtro.length + 1);j++){
				var posicion = j;
				for(var k = 0;k<arreglo_filtro.length;k++){
					if(arreglo_filtro[k] == arreglo_provincia[posicion]){
						coincide = true;
						posicion++;
					}
					else{
						coincide = false;
						break;
					}
				}
				if(coincide == true){
					break;
				}
			}

			if(coincide == true){
				lista_filtrada.push(lista[i]);
			}
		}

		var id;
		for(var i = 0;i<lista_filtrada.length;i++){
			if(i<9){
				lista_filtrada[i].mostrar = 1;
			}
			else{
				lista_filtrada[i].mostrar = 0;
			}
		}

		if(llamar_a_cambiar_mostrar == 1){
			if (texto_ingresado != ""){
				if(lista_filtrada.length == 0){
					mostrar = 0;
				}
				else{
					mostrar = 1;
				}
			}
			else{
				mostrar = 0;
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.cliente.provincias_filtradas		= lista_filtrada;
		$scope.buscador.cliente.fila_activa				= -1;
		$scope.buscador.cliente.mostrar				= mostrar;
		//-----------------------------------------------------------------------------------------------------------
		
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.scrollear_cliente = function(evt){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa				=	$scope.buscador.cliente.fila_activa;
		var lista_filtrada			=	$scope.buscador.cliente.provincias_filtradas;
		var elegido				=	$scope.cliente.provincia;
		//-----------------------------------------------------------------------------------------------------------

		if (!evt) evt = event;
		var direccion;
		(evt.detail<0) ? direccion = 1 : (evt.wheelDelta>0) ? direccion = 1 : direccion = -1;// console.log(direction);

		for( var i = 0;i<lista_filtrada.length;i++){
			if(lista_filtrada[i].mostrar == 1){
				break;
			}
		}

		if(direccion == 1){
			if(fila_activa > 0){
				fila_activa--;
				elegido	= lista_filtrada[fila_activa].nombre;
			}
			if(0 < i){
				 lista_filtrada[i-1].mostrar = 1;
				 lista_filtrada[i + 9].mostrar = 0;
			}
		}
		else{
			if(fila_activa <  lista_filtrada.length - 1){
				fila_activa++;
				elegido	=  lista_filtrada[fila_activa].nombre;
			}
			if(i+10 < lista_filtrada.length){
				lista_filtrada[i].mostrar = 0;
				lista_filtrada[i+10].mostrar = 1;
			}
		}

		//-----------------------------------------------------------------------------------------------------------
		$scope.buscador.cliente.fila_activa			= fila_activa;
		$scope.buscador.cliente.provincias_filtradas	= lista_filtrada;
		$scope.cliente.provincia					= elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________
});










//**************************************************************************************************************************************************************************
//														Directivas
//**************************************************************************************************************************************************************************



app.directive('ngScroll', ['$parse', function($parse) {
	return {
		restrict: 'A',
		link: function(scope, element, attr){
			var fn = $parse(attr['ngScroll']);
			element.bind('mousewheel', function (event){
				 scope.$apply(function() {
					 fn(scope, {$event:event});
				});
			});
		}
	};
}]);



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