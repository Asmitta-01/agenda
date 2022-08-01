<?php

namespace App\Controller;

use App\Entity\Agenda;
use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class AgendaController extends AbstractController
{
    #[Route(
        '{_locale}/agenda',
        name: 'app_agenda',
        requirements: ['_locale' => 'en|fr'],
        defaults: ['_locale' => 'en']
    )]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        /** @var User $user */
        $user = $this->getUser();
        if (!$user->getAgenda())
            $user->setAgenda(new Agenda);
        $agenda = $user->getAgenda();

        return $this->render('agenda/index.html.twig', [
            'title' => 'Your agenda',
            'events' => $agenda->getEvents(),
            'agenda' => $agenda
        ]);
    }
}
