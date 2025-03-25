#importacion de librerias para manejo de envio de email
from django.core.mail import EmailMessage
from django.core.mail import send_mail
from django.conf import settings

#clase para enviar email
class Util:
    @staticmethod
    def sendMail(data):            
        send_mail(data['email_subject'], data['email_body'], settings.EMAIL_HOST_USER, [data['to_email']])