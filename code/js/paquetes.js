

var app = angular.module('paquetes', []);

app.controller('controlador', function($scope, $http){
	
//	------------------------------------------------------------------------------------------------<variables>----------------------------------------------------------------------------------------------

	$scope.paneles = {
		buscar: true,
		agregar: false,
		editar: false
	};

	$scope.servicio = {
		fila_activa : -1,

		buscar : {
			nombre: "",
			articulo: "",
			accion: "buscar"
		},

		agregar : {
			nombre: "",
			accion: "agregar",
			habilitado : false,
			error : false
		},

		editar : {
			codigo: "",
			nombre: "",
			nombre_seleccionado : "",
			accion: "",
			habilitado : false,
			error : false
		},

		paquetes : []
	};

	$scope.contenido = {
		fila_activa : -1,
		modal_mensaje		: "",

		buscar : {
			id_paquete		: "",
			accion			: "buscar"
		},

		agregar : {
			id_paquete		: "",
			id_articulo			: "",
			asignacion		: 0,
			cantidad_articulos	: "",
			cantidad_pasajeros	: "",
			
			accion: "agregar"
		},

		eliminar : {
			id_contenido		: "",
			id_paquete		: "",
			accion			: "eliminar"
		},

		articulos : []
	};

	$scope.control = {
		todos_los_paquetes : []
	};

	$scope.modal = {
		mensaje : ""
	};
//	------------------------------------------------------------------------------------------------</variables>----------------------------------------------------------------------------------------------

	$scope.init = function(){
		$scope.paquete_buscar(2);
		$scope.articulos_buscar();
	};


	$scope.paneles = function(menu){
		switch(menu){
			case 1:	($scope.paneles.buscar == true)? $scope.paneles.buscar = false : $scope.paneles.buscar = true ;
					break;
			case 2 :	($scope.paneles.agregar == true)? $scope.paneles.agregar = false : $scope.paneles.agregar = true ;
					break;
			case 3 :	($scope.paneles.editar == true)? $scope.paneles.editar = false : $scope.paneles.editar = true ;
					break;
		}
	};

//	-----------------------------------------------<buscar>--------------------------------------------------------
	$scope.paquete_buscar = function(opcion){

		$http({method: 'POST', url: 'AJAX_paquetes.php',  data:$scope.servicio.buscar })
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

					switch(opcion){
						case 0 :	$scope.control.todos_los_paquetes = data.datos;break;
						case 1 :	$scope.servicio.paquetes			= data.datos;break;
						case 2 :	$scope.control.todos_los_paquetes = data.datos;
								$scope.servicio.paquetes			= data.datos;
								break;
					}

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});

			$scope.servicio.fila_activa = -1;
			$scope.servicio.editar.codigo = "";
			$scope.servicio.editar.nombre = "";
			$scope.servicio.editar.nombre_selccionado = "";
			$scope.servicio.editar.accion = "";
	};
//	-----------------------------------------------</buscar>-------------------------------------------------------


//	-----------------------------------------------<agregar>-------------------------------------------------------
	$scope.paquete_agregar = function(){

		$http({method: 'POST', url: 'AJAX_paquetes.php', data:$scope.servicio.agregar })
			.success(function(data, status, headers, config){
				var errores = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					$scope.modal.mensaje = data.errores[i];
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					$scope.modal.mensaje = data.alertas[i];
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if(!errores){
					$scope.modal.mensaje = "El paquete "+$scope.servicio.agregar.nombre+" fué agregado exitosamente";
					$('#mensaje').modal('show');
					if($scope.servicio.paquetes.length != 0){
						$scope.paquete_buscar(2);
					}
					else{
						$scope.paquete_buscar(0);
					}
					$scope.servicio.agregar.habilitado = false;
				}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};
//	-----------------------------------------------</agregar>------------------------------------------------------

//	-----------------------------------------------<editar>----------------------------------------------------------
	$scope.paquete_editar = function(){

		var nombre	= $scope.servicio.editar.nombre;
		var fila_activa	= $scope.servicio.fila_activa;
		var codigo	= $scope.servicio.editar.codigo;

		$scope.servicio.editar.accion = "editar";

		$http({method: 'POST', url: 'AJAX_paquetes.php', data:$scope.servicio.editar })
			.success(function(data, status, headers, config){
				var errores = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					$scope.modal.mensaje = data.errores[i];
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					$scope.modal.mensaje = data.alertas[i];
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if(!errores){
					$scope.modal.mensaje = "El paquete "+ $scope.servicio.editar.nombre +" fué modificado exitosamente";
					$('#mensaje').modal('show');
					$scope.paquete_buscar(2);
					$scope.servicio.fila_activa					= fila_activa;
					$scope.servicio.editar.nombre				= nombre;
					$scope.servicio.editar.nombre_seleccionado	= nombre;
					$scope.servicio.editar.codigo				= codigo;
					$scope.servicio.editar.habilitado			= false;
				}

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};
//	-----------------------------------------------</editar>---------------------------------------------------------

//	-----------------------------------------------<eliminar>-------------------------------------------------------
	$scope.paquete_eliminar = function(){

		$scope.servicio.editar.accion = "eliminar";

		$http({method: 'POST', url: 'AJAX_paquetes.php', data:$scope.servicio.editar })
			.success(function(data, status, headers, config){
				var errores = 0;

				for(var i=0; i<data.errores.length; i++){
					console.log(data.errores[i]);
					$scope.modal.mensaje = data.errores[i];
					errores++;
				}

				for(var i=0; i<data.alertas.length; i++){
					console.log(data.alertas[i]);
					$scope.modal.mensaje = data.alertas[i];
					errores++;
				}

				if(data.consulta != ""){
					console.log(data.consulta);
				}

				if(!errores){
					$scope.modal.mensaje = "Paquete eliminado";
					$('#mensaje').modal('show');
					$scope.paquete_buscar(2);
				}

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};
//	-----------------------------------------------</eliminar>------------------------------------------------------

	$scope.habilitar_agregar = function(){

		if($scope.servicio.agregar.nombre == ""){
			$scope.servicio.agregar.habilitado	= false;
			$scope.servicio.agregar.error		= false;
		}
		else{
			var coincidencia = false;
			for(var j = 0; j < $scope.control.todos_los_paquetes.length ;j++){
				if ($scope.servicio.agregar.nombre == $scope.control.todos_los_paquetes[j].nombre){
					$scope.servicio.agregar.habilitado = false;
					$scope.servicio.agregar.error = true;
					coincidencia = true;
					break;
				}
			}

			if(coincidencia == false){
				$scope.servicio.agregar.habilitado	= true;
				$scope.servicio.agregar.error		= false;
			}
		}
	};

	$scope.habilitar_editar = function(){

		if($scope.servicio.editar.nombre == ""){
			$scope.servicio.agregar.habilitado	= false;
			$scope.servicio.agregar.error		= false;
		}
		else{
			var coincidencia = false;
			for(var j = 0; j < $scope.control.todos_los_paquetes.length ;j++){
				if ($scope.servicio.editar.nombre == $scope.control.todos_los_paquetes[j].nombre){
					if($scope.servicio.editar.nombre != $scope.servicio.editar.nombre_seleccionado){
						$scope.servicio.editar.habilitado = false;
						$scope.servicio.editar.error = true;
						coincidencia = true;
						break;
					}
					else{
						$scope.servicio.editar.habilitado = false;
						$scope.servicio.editar.error = false;
						coincidencia = true;
					}
				}
			}
			if(coincidencia == false){
				$scope.servicio.editar.habilitado	= true;
				$scope.servicio.editar.error		= false;
			}
		}
	};


	$scope.paquete_seleccionar = function(index){

		$scope.servicio.fila_activa					= index;
		$scope.contenido.fila_activa				= -1;

		$scope.servicio.editar.codigo				= $scope.servicio.paquetes[index].codigo;
		$scope.servicio.editar.nombre				= $scope.servicio.paquetes[index].nombre;
		$scope.servicio.editar.nombre_seleccionado	= $scope.servicio.paquetes[index].nombre;

		$scope.contenido_buscar();
	};

//	-----------------------------------------------------------------------------------------------<PARTE AGREGADOS>----------------------------------------------------------------------------------------------

	$scope.contenido_buscar = function(){

		$scope.contenido.buscar.id_paquete = $scope.servicio.editar.codigo;

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.contenido.buscar })
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

				$scope.contenido.articulos = data.datos;

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.contenido_agregar = function(){

		$scope.contenido.agregar.id_paquete	= $scope.servicio.editar.codigo;
		$scope.contenido.agregar.id_articulo	= $scope.superbuscador.id_elegido;

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.contenido.agregar })
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

				$scope.modal.mensaje	= "Contenido agregado";
				$('#mensaje').modal('show');
				$scope.contenido_buscar();

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.contenido_eliminar = function(){

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.contenido.eliminar })
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

				$scope.modal.mensaje	= "contenido Eliminado";
				$('#mensaje').modal('show');
				$scope.contenido_buscar();

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.contenido_seleccionar = function(index){

		$scope.contenido.fila_activa			= index;
		$scope.contenido.eliminar.id_contenido	= $scope.contenido.articulos[index].codigo;
		$scope.contenido.eliminar.id_paquete	= $scope.servicio.editar.codigo;

	};





	$scope.articulos_buscar = function(){

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php'})
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

					$scope.superbuscador.articulos = data.datos;

//					for(var i = 0; i < $scope.articulos.length ;i++){					//elimino los artículos que ya tiene el paquete
//						for(var j = 0; j < $scope.contenido.length ;j++){
//							if ($scope.articulos[i].id == $scope.contenido[j].codigo){
//
//								    $scope.articulos.splice(i, 1);
//
//							}
//						}
//					}

		})
		.error(function(data, status, headers, config){
			console.log("error");
		});
	};

//__________________________________________________________________________________________________________________________________________________________________________
//------------------------------------------------------------------------------------------------<SUPERBUSCADOR>----------------------------------------------------------------------------------------------------------------
//________________________________________________________________________________________________________________________

	$scope.superbuscador = {

			fila_activa : "",
			filtro : "",
			mostrar : "",
			id_elegido : "",

			articulos_filtrados : [],
			articulos : []
	};

	$scope.evaluar = function(e){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa			= $scope.superbuscador.fila_activa;
		var texto_ingresado		= $scope.superbuscador.filtro;
		var lista_filtrada		= $scope.superbuscador.articulos_filtrados;
		var mostrar			= $scope.superbuscador.mostrar;
		var id_elegido			= $scope.superbuscador.id_elegido;
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
		$scope.superbuscador.fila_activa			= fila_activa;
		$scope.superbuscador.mostrar			= mostrar;
		$scope.superbuscador.lista_filtrada			= lista_filtrada;
		$scope.superbuscador.filtro				= texto_ingresado;
		$scope.superbuscador.id_elegido			= id_elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.verificar_coincidencias = function(verificar){

		//-----------------------------------------------------------------------------------------------------------
		var lista					= $scope.superbuscador.articulos;
		var texto_ingresado			= $scope.superbuscador.filtro;
		var id_elegido				= $scope.superbuscador.id_elegido;
		var fila_activa				= $scope.superbuscador.fila_activa;
		var lista_filtrada			= $scope.superbuscador.articulos_filtrados;
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
		$scope.superbuscador.filtro				= texto_ingresado;
		$scope.superbuscador.id_elegido			= id_elegido;
		$scope.superbuscador.mostrar			= 0;
		$scope.superbuscador.fila_activa			= fila_activa;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.seleccionar = function(index){
		$scope.superbuscador.fila_activa		= index;
		$scope.superbuscador.filtro			= $scope.superbuscador.articulos_filtrados[index].nombre;
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.filtrador = function(llamar_a_cambiar_mostrar){

		//-----------------------------------------------------------------------------------------------------------
		var lista				= $scope.superbuscador.articulos;
		var texto_ingresado		= $scope.superbuscador.filtro;
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
		$scope.superbuscador.articulos_filtrados		= lista_filtrada;
		$scope.superbuscador.fila_activa			= -1;
		$scope.superbuscador.mostrar			= mostrar;
		//-----------------------------------------------------------------------------------------------------------
		
	};
//________________________________________________________________________________________________________________________

//________________________________________________________________________________________________________________________
	$scope.scrollear = function(evt){

		//-----------------------------------------------------------------------------------------------------------
		var fila_activa				=	$scope.superbuscador.fila_activa;
		var lista_filtrada			=	$scope.superbuscador.articulos_filtrados;
		var elegido				=	$scope.superbuscador.filtro;
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
		$scope.superbuscador.fila_activa			= fila_activa;
		$scope.superbuscador.articulos_filtrados		= lista_filtrada;
		$scope.superbuscador.filtro				= elegido;
		//-----------------------------------------------------------------------------------------------------------
	};
//________________________________________________________________________________________________________________________


});



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