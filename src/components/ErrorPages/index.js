import parse from 'html-react-parser';
import React, { Component } from 'react';
import './errorPages.css';
class ErrorPages extends Component {
  render() {
    return (
      <>
        {parse(`
            <head>
              <link rel='stylesheet' href='https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.7/css/bootstrap.min.css'>
              <link rel='stylesheet' href='https://fonts.googleapis.com/css?family=Arvo'>
            </head>
          `)}

        <body>
          <section class="page_404">
            <div class="container">
              <div class="row">
                <div class="col-sm-12 ">
                  <div class="col-sm-10 col-sm-offset-1  text-center">
                    <div class="four_zero_four_bg">
                      <h1 class="text-center ">Ups! </h1>
                    </div>

                    <div class="contant_box_404">
                      <h3 class="h2">La página que estas buscando no existe</h3>

                      <p>Error 404</p>

                      <a href="/" class="link_404">
                        Volver
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </body>
      </>
    );
  }
}
export default ErrorPages;
