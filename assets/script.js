<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link
      />
    <title>Weather Dashboard</title>
  </head>
  <body>
			<h1>Weather Dashboard</h1>
				<div class="container-fluid mainCon">
					<div class="row">
						<div class="col-12 col-md-3 col-xl-3 colOne">
							<label>Search for a City:</label>

							<div class="input-group mb-3">
								<input type="text" class="form-control textVal" placeholder="Florida...">
								<div class="input-group-append btnPar">
									<button class="btn btn-primary search" type="button" id="button-addon2"><i class="fas fa-search"></i></button>
								</div>
							</div>

							<div class="container cityHist"></div>

						</div>
						<div class="col-12 col-md-9 col-xl-9 colTwo">

							<div class="row today">

								<div class="card bg-light mb-3 " style="max-width: 400px;">
									<h2 class="card-header cardTodayCityName"></h2>
									<h3 class="card-header cardTodayDate"></h3>
									<img class="icons"/>
									<div class="card-body cardBodyToday">
									</div>
								</div>

							</div>

							<div class="row fiveForecast"></div>

						</div>
    <script
      
    <script
      
  </body>
</html>