<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Event;
use App\Entity\Agenda;
use App\Form\EventType;
use Doctrine\ORM\EntityManagerInterface;
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
    public function index(EntityManagerInterface $entityManager): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        /** @var User $user */
        $user = $this->getUser();
        if (!$user->getAgenda()) {
            $user->setAgenda(new Agenda);
            $entityManager->persist($user);
            $entityManager->flush();
        }
        $agenda = $user->getAgenda();

        $event = new Event;
        $form = $this->createForm(EventType::class, $event);

        return $this->render('agenda/index.html.twig', [
            'title' => 'Your agenda',
            'events' => $agenda->getEvents(),
            'eventForm' => $form->createView()
        ]);
    }
}
