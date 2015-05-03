var app = angular.module('clientes', []);
app.controller('controlador', function($scope, $http){

// variables----------------------------------------------------------------------------

	$scope.buscar = {
		nombre : null
	}

	$scope.opcion = {
		receta_activa : -1,
		receta_seleccionada : -1,
		comida_activa : -1,
		comida_seleccionada : -1
	};

	$scope.comida_tipo_seleccionadas = {
		desayuno : false,
		almuerzo : false,
		merienda : false,
		cena : false
	};	


	$scope.recetas = [];	
	//Hardcodeo-----------------------------------------------------------------

	$scope.recetas = [
	    { id : 1, nombre: "Ensalada Caesar" },
		{ id : 2, nombre: "Tarta de choclo" },
		{ id : 3, nombre: "Tarta de Acelga" },
		{ id : 4, nombre: "Tarta de Atun"  },
		{ id : 5, nombre: "Tarta de Pollo"  },
		{ id : 6, nombre: "Toritlla de Papas"  },
		{ id : 7, nombre: "Fideos con Crema"  },
		{ id : 8, nombre: "Fideos con Salsa Blanca"  },
		{ id : 9, nombre: "Arroz con Pollo"  },
		{ id : 10, nombre: "Cafe con leche"  },
		{ id : 11, nombre: "Sopa de calabazas"  }
	];




    var desayuno = {
    	id : 1,
    	nombre : "desayuno",
    	receta : null
    };

    var almuerzo = {
    	id : 2,
    	nombre : "almuerzo",
    	receta : null
    };

    var merienda = {
    	id : 3,
    	nombre : "merienda",
    	receta : null
    };

    var cena = {
    	id : 4,
    	nombre : "cena",
    	receta : null
    };

	$scope.comidas = [desayuno,almuerzo,merienda,cena];
	//Hardcodeo-----------------------------------------------------------------



// functions----------------------------------------------------------------------------

	$scope.seleccionar_receta = function(index,receta_id){
		$scope.opcion.receta_activa	= index;
		$scope.opcion.receta_seleccionada	= receta_id;

	};

	$scope.seleccionar_comida = function(index,comida_id){
		$scope.opcion.comida_activa	= index;
		$scope.opcion.comida_seleccionada	= comida_id;
	};

	$scope.agregar_comida = function(){

		var receta_seleccionada_id = $scope.opcion.receta_seleccionada - 1;
		var receta_seleccionada_nombre;


		if ($scope.comida_tipo_seleccionadas.desayuno) {
			$scope.comidas[0].receta = $scope.recetas[receta_seleccionada_id].nombre;
		}
		if ($scope.comida_tipo_seleccionadas.almuerzo) {
			$scope.comidas[1].receta = $scope.recetas[receta_seleccionada_id].nombre;
		}
		if ($scope.comida_tipo_seleccionadas.merienda) {
			$scope.comidas[2].receta = $scope.recetas[receta_seleccionada_id].nombre;
		}
		if ($scope.comida_tipo_seleccionadas.cena) {
			$scope.comidas[3].receta = $scope.recetas[receta_seleccionada_id].nombre;
		}

		//reseteo el checkbox
		$scope.comida_tipo_seleccionadas.desayuno = false;
		$scope.comida_tipo_seleccionadas.almuerzo = false;
		$scope.comida_tipo_seleccionadas.merienda = false;
		$scope.comida_tipo_seleccionadas.cena = false;

	};

	$scope.quitar_comida = function() {

		var receta_seleccionada_id = $scope.opcion.comida_seleccionada -1;

		$scope.comidas[receta_seleccionada_id].receta = null;
	}
});
