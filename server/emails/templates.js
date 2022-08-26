//Do this
function notificationTemplate(neighborhoodName, neighbour, admin) {
  var text;
  if (admin) text = `Admin with mail ${admin.email}`;
  else if (neighbour)
    text = `Neighbour ${neighbour.name} ${neighbour.lastName}`;
  return `<p>${text} just joined ${neighborhoodName}</p>`;
}

function resetPasswordTemplate(config, token) {
  return `
    <html>
      <head> </head>
      <body>
        <html>
          <head> </head>
          <body>
            <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
              <tbody>
                <tr>
                  <td>
                    <table cellspacing="0" cellpadding="0" align="center">
                      <tbody>
                        <tr>
                          <td class="esd-stripe" bgcolor="#fafafa">
                            <table
                              class="es-footer-body"
                              width="600"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tbody>
                                <tr>
                                  <td style="background-color: #388087">
                                    <p
                                      style="
                                        font-size: 24px;
                                        color: #ffffff;
                                        text-align: center;
                                      "
                                    >
                                      HomeFix
                                    </p>
                                    <p
                                      style="
                                        font-size: 14px;
                                        color: #ffffff;
                                        text-align: center;
                                      "
                                    >
                                      Tu lugar de reseñas confiables
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td>
                    <table
                      class="es-content"
                      cellspacing="0"
                      cellpadding="0"
                      align="center"
                    >
                      <tbody>
                        <tr>
                          <td class="esd-stripe" style="background-color: #fafafa">
                            <table
                              class="es-content-body"
                              style="background-color: #ffffff"
                              width="600"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      background-color: transparent;
                                      background-position: left top;
                                    "
                                  >
                                    <table
                                      width="100%"
                                      cellspacing="0"
                                      cellpadding="0"
                                    >
                                      <tbody>
                                        <tr>
                                          <td>
                                            <table
                                              style="background-position: left top"
                                              width="100%"
                                              cellspacing="0"
                                              cellpadding="0"
                                            >
                                              <tbody>
                                                <tr>
                                                  <td
                                                    class="
                                                      esd-block-image
                                                      es-p5t es-p5b
                                                    "
                                                    align="center"
                                                    style="font-size: 0"
                                                  >
                                                    <a target="_blank"
                                                      ><img
                                                        src="password.png"
                                                        alt
                                                        style="display: block"
                                                        width="175"
                                                    /></a>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="text-align: center">
                                                    <h1
                                                      style="
                                                        color: #333333;
                                                        font-size: 20px;
                                                      "
                                                    >
                                                      <strong
                                                        >Ha olvidado su contraseña?
                                                      </strong>
                                                    </h1>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="text-align: center">
                                                    <p
                                                      style="
                                                        text-align: center;
                                                        color: black;
                                                      "
                                                    >
                                                      Hola usuario,
                                                    </p>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td>
                                                    <p
                                                      style="
                                                        text-align: center;
                                                        color: black;
                                                      "
                                                    >
                                                      Por favor haga click sobre el
                                                      siguiente link para restaurar
                                                      su contraseña
                                                    </p>
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="text-align: center">
                                                    <span class="es-button-border"
                                                      ><a
                                                        href="${process.env.CLIENT_URL}/resetPassword/${token}"
                                                        class="es-button"
                                                        target="_blank"
                                                        >RESTAURAR CONTRASEñA</a
                                                      ></span
                                                    >
                                                  </td>
                                                </tr>
                                                <tr>
                                                  <td style="text-align: center">
                                                    <p>
                                                      Si usted no ha solicitado un
                                                      cambio de contraseña, por
                                                      favor ignore este email.
                                                    </p>
                                                  </td>
                                                </tr>
                                              </tbody>
                                            </table>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <tr>
                      <td>
                        <table
                          class="es-footer"
                          cellspacing="0"
                          cellpadding="0"
                          align="center"
                        >
                          <tbody>
                            <tr>
                              <td>
                                <table
                                  class="es-footer-body"
                                  width="600"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td style="background-color: #388087">
                                        <p
                                          style="
                                            font-size: 14px;
                                            color: #ffffff;
                                            text-align: center;
                                          "
                                        >
                                          Gracias por utilizar HomeFix
                                        </p>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </td>
                </tr>
              </tbody>
            </table>
          </body>
        </html>
      </body>
    </html>
    `;
}

function activationTemplate(config, token) {
  return `
<html>
  <head> </head>
  <body>
    <html>
      <head> </head>
      <body>
        <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
          <tbody>
            <tr>
              <td>
                <table cellspacing="0" cellpadding="0" align="center">
                  <tbody>
                    <tr>
                      <td class="esd-stripe" bgcolor="#fafafa">
                        <table
                          class="es-footer-body"
                          width="600"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tbody>
                            <tr>
                              <td style="background-color: #388087">
                                <p
                                  style="
                                    font-size: 24px;
                                    color: #ffffff;
                                    text-align: center;
                                  "
                                >
                                  HomeFix
                                </p>
                                <p
                                  style="
                                    font-size: 14px;
                                    color: #ffffff;
                                    text-align: center;
                                  "
                                >
                                  Tu lugar de reseñas confiables
                                </p>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
            <tr>
              <td>
                <table
                  class="es-content"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                >
                  <tbody>
                    <tr>
                      <td class="esd-stripe" style="background-color: #fafafa">
                        <table
                          class="es-content-body"
                          style="background-color: #ffffff"
                          width="600"
                          cellspacing="0"
                          cellpadding="0"
                        >
                          <tbody>
                            <tr>
                              <td
                                style="
                                  background-color: transparent;
                                  background-position: left top;
                                "
                              >
                                <table
                                  width="100%"
                                  cellspacing="0"
                                  cellpadding="0"
                                >
                                  <tbody>
                                    <tr>
                                      <td>
                                        <table
                                          style="background-position: left top"
                                          width="100%"
                                          cellspacing="0"
                                          cellpadding="0"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                class="
                                                  esd-block-image
                                                  es-p5t es-p5b
                                                "
                                                align="center"
                                                style="font-size: 0"
                                              >
                                                <a target="_blank"
                                                  ><img
                                                    src="activate.png"
                                                    alt
                                                    style="display: block"
                                                    width="175"
                                                /></a>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="text-align: center">
                                                <h1
                                                  style="
                                                    color: #333333;
                                                    font-size: 20px;
                                                  "
                                                >
                                                  <strong
                                                    >Bienvenido a HomeFix
                                                  </strong>
                                                </h1>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="text-align: center">
                                                <p
                                                  style="
                                                    text-align: center;
                                                    color: black;
                                                  "
                                                >
                                                  Hola usuario,
                                                </p>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td>
                                                <p
                                                  style="
                                                    text-align: center;
                                                    color: black;
                                                  "
                                                >
                                                  Por favor haga click sobre el
                                                  siguiente link para activar su
                                                  cuenta
                                                </p>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="text-align: center">
                                                <span class="es-button-border"
                                                  ><a
                                                    href="${process.env.CLIENT_URL}/auth/activate/${token}"
                                                    class="es-button"
                                                    target="_blank"
                                                    >ACTIVAR CUENTA</a
                                                  ></span
                                                >
                                              </td>
                                            </tr>
                                            <tr>
                                              <td style="text-align: center">
                                                <p
                                                  style="
                                                    text-align: center;
                                                    color: rgb(155, 150, 150);
                                                  "
                                                >
                                                  Si usted no ha solicitado una
                                                  activacion de cuenta, por
                                                  favor ignore este email.
                                                </p>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <tr>
                  <td>
                    <table
                      class="es-footer"
                      cellspacing="0"
                      cellpadding="0"
                      align="center"
                    >
                      <tbody>
                        <tr>
                          <td>
                            <table
                              class="es-footer-body"
                              width="600"
                              cellspacing="0"
                              cellpadding="0"
                            >
                              <tbody>
                                <tr>
                                  <td style="background-color: #388087">
                                    <p
                                      style="
                                        font-size: 14px;
                                        color: #ffffff;
                                        text-align: center;
                                      "
                                    >
                                      Gracias por utilizar HomeFix
                                    </p>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </td>
                </tr>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>
  </body>
</html>
`;
}
exports.notificationTemplate = notificationTemplate;
exports.resetPasswordTemplate = resetPasswordTemplate;
exports.activationTemplate = activationTemplate;