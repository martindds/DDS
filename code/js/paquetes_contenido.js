

var app = angular.module('paquetes', []);

app.controller('controlador', function($scope, $http){

//	--------------------------------------------------------------------------------<VARIABLES>------------------------------------------------------------------------------------------------------------------------------------
	$scope.editar_o_agregar = {
		editar: false,
		agregar: true
	};

	$scope.modal = {
		mensaje : ""
	};

	$scope.opcion = {
		fila_activa: -1,
		fila_activa_art: -1
	};

	$scope.paneles = {
		agregar: true,
		editar: false
	};

	$scope.mostrar = {
		tabla : false,
		mensaje : true,
		cada_agregar : true,
		cada_editar : true
	};

	$scope.paquete = {
		id_paquete: "",
		nombre: "",
		accion: "contenido"
	};

	$scope.editar = {
		id_paquete: "",
		id_articulo_actual: "",							//referencia al artículo actual
		id_articulo: "",
		cantidad: "",
		por: "",
		cada: "",
		accion: "editar"
	};

	$scope.agregar = {
		id_paquete : "",
		id_articulo: "",
		cantidad: "",
		por: "",
		cada: "",
		accion: "agregar"
	};

	$scope.articulo = {
		id : "",
		nombre : "",
		filtro : "",
		accion: "articulos"
	};

	$scope.error = {
		editar : false,
		agregar : false
	};
	
	$scope.result1 = '';

	$scope.contenido = [];

	$scope.articulos = [];

//	--------------------------------------------------------------------------------</VARIABLES>-----------------------------------------------------------------------------------------------------------------------------------

//	--------------------------------------------------------------------------------<INIT>----------------------------------------------------------------------------------------------------------------------------------------------
	$scope.check = function(num){
		if(num == $scope.fila_activa){
			return true;
		}
		return false;
	};

	$scope.init = function(){

		$scope.articulos_buscar(1);
		$scope.paquete.id_paquete = $("#id_paquete").val();

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.paquete })
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

					if(data.datos.length == 0){
						$scope.mostrar.tabla = false;
						$scope.mostrar.mensaje = true;
					}

					else{
						$scope.mostrar.tabla = true;
						$scope.mostrar.mensaje = false;
					}

					$scope.contenido = data.datos;
					$scope.paquete.nombre = data.paquete;				//para mostrar el nombre del paquete
				})
				.error(function(data, status, headers, config){
					console.log("error");
				});
	};
//	--------------------------------------------------------------------------------</INIT>---------------------------------------------------------------------------------------------------------------------------------------------

//	-------------------------------------------------------------------------------<MODAL>------------------------------------------------------------------------------------------------------------------------------------------
	$scope.articulos_buscar = function(a){

		switch (a){
			case 1 :	$scope.editar_o_agregar.agregar = true;
					$scope.editar_o_agregar.editar = false;
					break;
			case 2 :	$scope.editar_o_agregar.agregar = false;
					$scope.editar_o_agregar.editar = true;
					break;
		}

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.articulo })
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

					$scope.articulos = data.datos;

					for(var i = 0; i < $scope.articulos.length ;i++){					//elimino los artículos que ya tiene el paquete
						for(var j = 0; j < $scope.contenido.length ;j++){
							if ($scope.articulos[i].id == $scope.contenido[j].codigo){

								    $scope.articulos.splice(i, 1);

							}
						}
					}

			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

	$scope.articulos_elegir = function(){

		if($scope.editar_o_agregar.editar != true){
			$scope.agregar.id_articulo = $scope.articulo.id;
			$("#agregar").prop('disabled',false);
		}

		if($scope.editar_o_agregar.agregar != true){
			$scope.editar.id_articulo = $scope.articulo.id;
		}
	};

	$scope.articulo_seleccionar = function(index){

		$scope.opcion.fila_activa_art = index;

		$scope.articulo.id = $scope.articulos[index].id;
		$scope.articulo.nombre = $scope.articulos[index].nombre;

		$("#elegir").prop('disabled',false);
	};

//	--------------------------------------------------------------------------------</MODAL>----------------------------------------------------------------------------------------------------------------------------------------


//	--------------------------------------------------------------------------------<ABM>---------------------------------------------------------------------------------------------------------------------------------------------
	$scope.articulos_agregar = function(){

		$scope.agregar.id_paquete = $scope.paquete.id_paquete;

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.agregar })
				.success(function(data, status, headers, config){

					var errores = 0;

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
						$scope.modal.mensaje = data.errores[0];
						errores++;
					}
					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
					}
					for(var i=0; i<data.consulta.length; i++){
						console.log(data.consulta[i]);
					}

					if(!errores){
						$scope.modal.mensaje = "Artículo agregado exitosamente";
						$scope.init();
					}

					if( $scope.agregar.id_articulo != ""){
						$('#mensaje').modal('show');
					}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};


	$scope.articulos_editar = function(){

		$scope.editar.accion = "editar";
		$scope.editar.id_paquete = $scope.paquete.id_paquete;

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.editar })
				.success(function(data, status, headers, config){

					var errores = 0;

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
						$scope.modal.mensaje = data.errores[0];
						errores++;
					}
					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
					}
					for(var i=0; i<data.consulta.length; i++){
						console.log(data.consulta[i]);
					}

					if(!errores){
						$scope.modal.mensaje = "Editado exitosamente";
						$scope.init();
					}

					if( $scope.editar.id_articulo != ""){
						$('#mensaje').modal('show');
					}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
			
			$scope.editar.id_articulo_actual = $scope.editar.id_articulo;
	};

	$scope.articulos_eliminar = function(){

		$scope.editar.accion = "eliminar";
		$scope.editar.id_paquete = $scope.paquete.id_paquete;

		$http({method: 'POST', url: 'AJAX_paquetes_contenido.php',  data:$scope.editar })
				.success(function(data, status, headers, config){

					var errores = 0;

					for(var i=0; i<data.errores.length; i++){
						console.log(data.errores[i]);
						$scope.modal.mensaje = data.errores[0];
						errores++;
					}
					for(var i=0; i<data.alertas.length; i++){
						console.log(data.alertas[i]);
					}
					for(var i=0; i<data.consulta.length; i++){
						console.log(data.consulta[i]);
					}

					if(!errores){
						$scope.modal.mensaje = "Artículo eliminado";
						$scope.init();
					}

					if( $scope.editar.id_articulo != ""){
						$('#mensaje').modal('show');
					}
			})
			.error(function(data, status, headers, config){
				console.log("error");
			});
	};

//	--------------------------------------------------------------------------------</ABM>-------------------------------------------------------------------------------------------------------------------------------------


	$scope.accion_seleccionar = function(index){

		$scope.opcion.fila_activa = index;
		$scope.error.editar = false;

		$scope.editar.id_articulo = $scope.contenido[index].codigo;				
		$scope.editar.id_articulo_actual = $scope.contenido[index].codigo;				//Queda fijo
		$scope.editar.cantidad = $scope.contenido[index].cantidad;
		$scope.editar.por = $scope.contenido[index].por;
		$scope.editar.cada = $scope.contenido[index].cada;
		
		if ($scope.contenido[index].por == 1){
			$scope.mostrar.cada_editar = true;
		}
		else{
			$scope.mostrar.cada_editar = false;
		}

		$("#editar").prop('disabled',false);
		$("#eliminar").prop('disabled',false);
		$("#trigger_articulos").prop('disabled',false);

	};



	$scope.habilitar_desabilitar_porcada = function(a){
		if(a==1){
			if($scope.agregar.por == 1){
				$scope.mostrar.cada_agregar = true;
			}

			else{
				$scope.mostrar.cada_agregar = false;
			}
		}
		else{
			if($scope.editar.por == 1){
				$scope.mostrar.cada_editar = true;
			}

			else{
				$scope.mostrar.cada_editar = false;
			}
		}
	};

	$scope.habilitar_agregar = function(){


		if($scope.agregar.id_articulo == ""){
			$("#agregar").prop('disabled',true);
			$scope.error.agregar = false;
		}
		else{
			$scope.error.agregar = false;
			for(var j = 0; j < $scope.contenido.length ;j++){
				if ($scope.agregar.id_articulo == $scope.contenido[j].codigo){
					$scope.error.agregar = true;
				}
			}

			if($scope.error.agregar == true){
				 $("#agregar").prop('disabled',true);
			}
			else{
				$("#agregar").prop('disabled',false);
			}
		}
	};

	$scope.habilitar_editar = function(){

		if($scope.editar.id_articulo == ""){
			$("#editar").prop('disabled',true);
			$scope.error.editar = true;
		}
		else{
			$scope.error.editar = false;
			for(var j = 0; j < $scope.contenido.length ;j++){
				if ($scope.editar.id_articulo == $scope.contenido[j].codigo){
					if($scope.editar.id_articulo != $scope.editar.id_articulo_actual){
						$scope.error.editar = true;
					}
				}
			}
			
			if($scope.error.editar == true){
				 $("#editar").prop('disabled',true);
			}
			else{
				$("#editar").prop('disabled',false);
			}

		}
	};
});