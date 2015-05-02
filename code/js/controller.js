
var controlador = angular.module('mi_controlador',[]);

var pie_de_pagina = "Creado por Martin Amaya";

controlador.controller('CartController',
	function ($scope) {
		$scope.items =	[	{title: 'Paint pots', quantity: 0, price: 1},
						{title: 'Polka dots', quantity: 0, price: 2},
						{title: 'Pebbles', quantity: 0,  price: 3}
					];

		$scope.pie = pie_de_pagina;
		$scope.password = "";
		$scope.confirmacion = "incorrecto";

		$scope.remove = function(index) {
			$scope.items.splice(index, 1);
		};

		$scope.cambio = function(){
			if ($scope.password == "hola"){
				$scope.confirmacion = "correcto";
			}
			else{
				$scope.confirmacion = "incorrecto";
			}
		};

	}
);